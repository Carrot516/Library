// server/routes/router.ts

import { Router } from "https://deno.land/x/oak/mod.ts";
import authRouter from "./authRouter.ts";
import bookRouter from "./bookRouter.ts";
// Importuj inne routery w razie potrzeby

const router = new Router();

// Łączenie różnych routerów
router.use("/api/auth", authRouter.routes(), authRouter.allowedMethods());
router.use("/api/books", bookRouter.routes(), bookRouter.allowedMethods());
// Dodaj inne trasy tutaj

// Fallback Route
router.all("(.*)", (context) => {
    context.response.status = 404;
    context.response.body = { message: "Strona nie znaleziona" };
});

export default router;
