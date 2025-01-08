import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client({
    user: "Carrot516",
    database: "postgres",
    hostname: "grumpily-legitimate-shearwater.data-1.use1.tembo.io",
    port: 5432,
    password: "VpTdDi3NTGobmeqA",
});

export async function connectDB() {
    await client.connect();
    console.log("Połączono z bazą PostgreSQL!");
}

export { client };
