// import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
//
// const client = new Client({
//     user: "Carrot516",
//     database: "postgres",
//     hostname: "grumpily-legitimate-shearwater.data-1.use1.tembo.io",
//     port: 5432,
//     password: "VpTdDi3NTGobmeqA",
// });
//
// export async function connectDB() {
//     await client.connect();
//     console.log("Połączono z bazą PostgreSQL!");
// }
//
// export { client };


// server/database/db.ts
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client({
    user: "postgres",
    database: "postgres",
    hostname: "grumpily-legitimate-shearwater.data-1.use1.tembo.io",
    port: 5432,
    password: "VpTdDi3NTGobmeqA",
    tls: {
        caCertificates: [
            await Deno.readTextFile(
                new URL("./ca.crt", import.meta.url),
            ),
        ],
        enabled: true,
    },
});

export async function connectDB() {
    try {
        await client.connect();
        console.log("Połączono z bazą PostgreSQL!");
    } catch (error) {
        console.error("Błąd połączenia z bazą:", error);
        Deno.exit(1);
    }
}

export { client };
