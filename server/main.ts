// // main.ts
// import { Application } from "jsr:@oak/oak/application";
// import { Router } from "jsr:@oak/oak/router";
// import { oakCors } from "@tajpouria/cors";
// import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
// import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
//
// // Import z pliku db.ts, gdzie tworzysz i eksportujesz connectDB()
// import { connectDB } from "./database/db.ts";
//
// // Tworzymy instancję aplikacji Oak
// export const app = new Application();
// const router = new Router();
//
// const pass = Deno.env.get("DB_PASS");
// const pool = new Client({
//   user: "postgres",
//   database: "postgres",
//   hostname: "grumpily-legitimate-shearwater.data-1.use1.tembo.io",
//   port: 5432,
//   password: "VpTdDi3NTGobmeqA",
//   tls: {
//     caCertificates: [
//       await Deno.readTextFile(
//           new URL("./ca.crt", import.meta.url),
//       ),
//     ],
//     enabled: true,
//   },
// }, 5, true);
// const connection = await pool.connect();
//
//
//
//
//
//
//
//
//
//
//
//
// // Middleware: CORS, routery, statyczne pliki
// app.use(oakCors());
// app.use(router.routes());
// app.use(router.allowedMethods());
// app.use(
//     routeStaticFilesFrom([
//       `${Deno.cwd()}/client/dist`,
//       `${Deno.cwd()}/client/public`,
//     ]),
// );
//
// // Uruchamiamy serwer *tylko* jeśli ten plik jest wykonywany jako główny
// if (import.meta.main) {
//   console.log("Server listening on port http://localhost:8000");
//   await app.listen({ port: 8000 });
// }


// server/main.ts
import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
// Usuń ten import, jeśli nie jest potrzebny
import data from "./api/data.json" with { type: "json" };
import { connectDB, client } from "./database/db.ts";

// Tworzenie instancji aplikacji Oak
const app = new Application();
const router = new Router();

// Middleware: Globalna obsługa błędów
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Globalny błąd:", err);
    ctx.response.status = err.status || 500;
    ctx.response.body = { error: err.message || "Internal Server Error" };
  }
});

// Middleware: CORS
app.use(oakCors());

// Endpoint: Wyszukiwanie książek z filtrami
router.get("/api/books", async (context) => {

  const url = new URL(context.request.url);

  const bookName = url.searchParams.get("book_name");
  const authorName = url.searchParams.get("author");
  const genre = url.searchParams.get("genre");
  const releaseYear = url.searchParams.get("release_year");

  let query = `
        SELECT
          erd_biblioteka_projekt.book_info.bookid,
          erd_biblioteka_projekt.book_info.book_name,
          erd_biblioteka_projekt.book_info.book_release_year,
          erd_biblioteka_projekt.book_info.book_orig_lang,
          erd_biblioteka_projekt.author_info.author_name,
            array_agg(erd_biblioteka_projekt.book_genres.genre) AS genres
        FROM
          erd_biblioteka_projekt.book_info
        LEFT JOIN
          erd_biblioteka_projekt.author_info ON erd_biblioteka_projekt.book_info.book_author_id = erd_biblioteka_projekt.author_info.author_id
        LEFT JOIN
          erd_biblioteka_projekt.book_genres ON erd_biblioteka_projekt.book_info.bookid = erd_biblioteka_projekt.book_genres.bookid
    `;
  console.log("Otrzymano żądanie do /api/books");


  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (bookName) {
    conditions.push(`erd_biblioteka_projekt.book_info.book_name ILIKE $${paramIndex}`);
    params.push(`%${bookName}%`);
    paramIndex++;
  }

  if (authorName) {
    conditions.push(`erd_biblioteka_projekt.author_info.author_name ILIKE $${paramIndex}`);
    params.push(`%${authorName}%`);
    paramIndex++;
  }

  if (genre) {
    conditions.push(`erd_biblioteka_projekt.book_genres.genre ILIKE $${paramIndex}`);
    params.push(`%${genre}%`);
    paramIndex++;
  }

  if (releaseYear) {
    const year = parseInt(releaseYear);
    if (!isNaN(year)) {
      conditions.push(`book_info.book_release_year = $${paramIndex}`);
      params.push(year);
      paramIndex++;
    } else {
      context.response.status = 400;
      context.response.body = { error: "Invalid release year." };
      return;
    }
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` GROUP BY book_info.bookid, author_info.author_id`;

  try {
    const result = await client.queryObject(query, ...params);
    context.response.status = 200;
    context.response.body = result.rows;
  } catch (error) {
    console.error("Błąd zapytania:", error);
    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

// (Opcjonalnie) Usuń lub zaktualizuj stare trasy związane z dinozaurami
router.get("/api/dinosaurs", (context) => {
  context.response.body = "Endpoint do dinozaurów - do usunięcia lub zaktualizowania.";
});

// Middleware: Router
app.use(router.routes());
app.use(router.allowedMethods());

// Middleware: Serwowanie plików statycznych
app.use(
    routeStaticFilesFrom([
      `${Deno.cwd()}/client/dist`,
      `${Deno.cwd()}/client/public`,
    ]),
);

// Uruchamiamy serwer *tylko* jeśli ten plik jest wykonywany jako główny
if (import.meta.main) {
  // Nawiązywanie połączenia z bazą danych
  await connectDB();

  // Start serwera Oak
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
