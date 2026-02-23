import { Router } from "express";
import * as controller from "../controllers/alertaController";

const router = Router();

router.post("/", controller.criar);
router.get("/dashboard", controller.dashboard);
router.patch("/:id/status", controller.atualizarStatus);
router.get("/tipo/:tipo", controller.filtrar);
router.get("/", controller.listar);
router.put("/:id", controller.atualizar);

export default router;