import { Router } from "express";
import * as controller from "../controllers/usuarioController";

const router = Router();

router.post("/cadastro", controller.cadastrar);

router.post("/login", controller.login);

router.get("/", controller.listar);

router.delete("/:id", controller.deletar);

export default router;