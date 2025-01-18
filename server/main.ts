import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { connectDB, client } from "./database/db.ts";

const app = new Application();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Globalny błąd:", err);
    ctx.response.status = err.status || 500;
    ctx.response.body = { error: err.message || "Internal Server Error" };
  }
});

app.use(oakCors());

router.get("/api/books", async (context) => {

  const url = new URL(context.request.url);

  const bookName = url.searchParams.get("book_name");
  const authorName = url.searchParams.get("author");
  const genre = url.searchParams.get("genre");
  const releaseYear = url.searchParams.get("release_year");

  // console.log("Received filters:", { bookName, authorName, genre, releaseYear });

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
  // console.log("Initial Query:", query);

  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (bookName) {
    conditions.push(`erd_biblioteka_projekt.book_info.book_name ILIKE $NAME`);
    params.push(`%${bookName}%`);
    paramIndex++;
  }

  if (authorName) {
    conditions.push(`erd_biblioteka_projekt.author_info.author_name ILIKE $AUTHOR`);
    params.push(`%${authorName}%`);
    paramIndex++;
  }

  if (genre) {
    conditions.push(`erd_biblioteka_projekt.book_genres.genre ILIKE $GENRE`);
    params.push(`%${genre}%`);
    paramIndex++;
  }

  // if (releaseYear) {
  //   const year = parseInt(releaseYear);
  //   if (!isNaN(year)) {
  //     conditions.push(`book_info.book_release_year = $YEAR`);
  //     params.push(`%${releaseYear}%`);
  //     paramIndex++;
  //   } else {
  //     context.response.status = 400;
  //     context.response.body = { error: "Invalid release year." };
  //     return;
  //   }
  // }
  if (releaseYear) {
    // Niepotrzebne parseInt, skoro traktujemy rok jak tekst
    conditions.push(`erd_biblioteka_projekt.book_info.book_release_year::text ILIKE $YEAR`);
    params.push(`%${releaseYear}%`);
    paramIndex++;
  }


  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` GROUP BY erd_biblioteka_projekt.book_info.bookid, erd_biblioteka_projekt.author_info.author_id`;
  // console.log("Final Query:", query);
  // console.log("Query Parameters:", params);

  try {
    console.log(query);
    const result = await client.queryArray(query,{name:`%${bookName}%`,author:`%${authorName}%`,genre:`%${genre}%`,year:`%${releaseYear}%`});
    console.log("Query Result:", result);
    context.response.status = 200;
    context.response.body = result.rows;
  } catch (error) {
    console.error("Błąd zapytania:", error);
    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});



app.use(router.routes());
app.use(router.allowedMethods());

app.use(
    routeStaticFilesFrom([
      `${Deno.cwd()}/client/dist`,
      `${Deno.cwd()}/client/public`,
    ]),
);

if (import.meta.main) {
  await connectDB();

  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
