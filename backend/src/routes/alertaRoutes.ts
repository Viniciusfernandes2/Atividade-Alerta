import { Router } from "express";

import * as controller from "../controllers/alertaController";

const router = Router();

router.post("/", controller.criar);

router.get("/", controller.listar);

router.get("/tipo/:tipo", controller.filtrar);

router.put("/:id", controller.atualizar);

router.get("/dashboard", controller.dashboard);

export default router;