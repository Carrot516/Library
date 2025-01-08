// main.ts
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
// Ten import możesz usunąć lub zmienić, jeśli nie używasz już data.json z dinozaurami:
import data from "./api/data.json" with { type: "json" };
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Import z pliku db.ts, gdzie tworzysz i eksportujesz connectDB()
import { connectDB } from "./database/db.ts";

// Tworzymy instancję aplikacji Oak
export const app = new Application();
const router = new Router();

const pass = Deno.env.get("DB_PASS");
const pool = new Client({
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
}, 5, true);
const connection = await pool.connect();










// Przykładowe trasy (obecne jeszcze z szablonu "dinosaurs")
router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "No dinosaur name provided.";
    return;
  }
  const dinosaur = data.find(
      (item) =>
          item.name.toLowerCase() === context.params.dinosaur.toLowerCase(),
  );
  context.response.body = dinosaur ?? "No dinosaur found.";
});

// Middleware: CORS, routery, statyczne pliki
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(
    routeStaticFilesFrom([
      `${Deno.cwd()}/client/dist`,
      `${Deno.cwd()}/client/public`,
    ]),
);

// Uruchamiamy serwer *tylko* jeśli ten plik jest wykonywany jako główny
if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
