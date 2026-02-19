import express from "express";

import cors from "cors";

import routes from "./routes/alertaRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/alertas", routes);

app.listen(3001, () => {

console.log("Servidor rodando");

});