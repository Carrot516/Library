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


router.post("/api/books", async (context) => {
  const body = await context.request.body();
  const data = await body.value;

  const { book_name, book_release_year, book_orig_lang, author_name, genres } = data;

  if (!book_name || !author_name) {
    context.response.status = 400;
    context.response.body = { error: "Missing required fields: book_name and author_name." };
    return;
  }

  try {
    // Sprawdź, czy autor już istnieje
    const authorResult = await client.queryArray(
        `SELECT author_id FROM erd_biblioteka_projekt.author_info WHERE author_name = $1`,
        author_name
    );

    let author_id: number;

    if (authorResult.rows.length > 0) {
      author_id = authorResult.rows[0][0];
    } else {
      // Dodaj nowego autora
      const insertAuthor = await client.queryArray(
          `INSERT INTO erd_biblioteka_projekt.author_info (author_name) VALUES ($1) RETURNING author_id`,
          author_name
      );
      author_id = insertAuthor.rows[0][0];
    }

    // Dodaj nową książkę
    const insertBook = await client.queryArray(
        `INSERT INTO erd_biblioteka_projekt.book_info (book_name, book_release_year, book_orig_lang, book_author_id) VALUES ($1, $2, $3, $4) RETURNING bookid`,
        book_name,
        book_release_year,
        book_orig_lang,
        author_id
    );

    const bookid = insertBook.rows[0][0];

    // Dodaj gatunki
    for (let genre of genres) {
      await client.queryArray(
          `INSERT INTO erd_biblioteka_projekt.book_genres (genre, bookid) VALUES ($1, $2)`,
          genre,
          bookid
      );
    }

    context.response.status = 201;
    context.response.body = { message: "Book added successfully.", bookid };
  } catch (error) {
    console.error("Error adding book:", error);
    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});


// main.ts (dodaj poniższy kod przed `app.use(router.routes())`)

router.post("/api/assign", async (context) => {
  const body = await context.request.body();
  const data = await body.value;

  const { book_id, library_id, status } = data;

  if (!book_id || !library_id || !status) {
    context.response.status = 400;
    context.response.body = { error: "Missing required fields: book_id, library_id, and status." };
    return;
  }

  try {
    // Sprawdź, czy książka istnieje
    const bookResult = await client.queryArray(
        `SELECT bookid FROM erd_biblioteka_projekt.book_info WHERE bookid = $1`,
        book_id
    );

    if (bookResult.rows.length === 0) {
      context.response.status = 404;
      context.response.body = { error: "Book not found." };
      return;
    }

    // Sprawdź, czy biblioteka istnieje
    const libraryResult = await client.queryArray(
        `SELECT libraryid FROM erd_biblioteka_projekt.library_branch WHERE libraryid = $1`,
        library_id
    );

    if (libraryResult.rows.length === 0) {
      context.response.status = 404;
      context.response.body = { error: "Library not found." };
      return;
    }

    // Przypisz książkę do biblioteki
    const assignResult = await client.queryArray(
        `INSERT INTO erd_biblioteka_projekt.book_list (library_id, book_id, status) VALUES ($1, $2, $3) RETURNING book_list_id`,
        library_id,
        book_id,
        status
    );

    const book_list_id = assignResult.rows[0][0];

    context.response.status = 201;
    context.response.body = { message: "Book assigned to library successfully.", book_list_id };
  } catch (error) {
    console.error("Error assigning book:", error);
    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});


// main.ts (dodaj poniższy kod przed `app.use(router.routes())`)

router.get("/api/libraries", async (context) => {
  try {
    const result = await client.queryArray(`
      SELECT libraryid, library_name FROM erd_biblioteka_projekt.library_branch
    `);

    const libraries = result.rows.map(row => ({
      libraryid: row[0],
      library_name: row[1],
    }));

    context.response.status = 200;
    context.response.body = libraries;
  } catch (error) {
    console.error("Error fetching libraries:", error);
    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
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
