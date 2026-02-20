import express from "express";

import cors from "cors";

import routes from "./routes/alertaRoutes";

import usuarioRoutes from "./routes/usuarioRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/alertas", routes);

app.use("/usuarios", usuarioRoutes);

app.listen(3001, () => {

console.log("Servidor rodando");

});