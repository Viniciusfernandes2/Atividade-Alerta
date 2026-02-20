import { Request, Response } from "express";
import * as service from "../services/usuarioServices";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "segredo";

// cadastro
export const cadastrar = async (req: Request, res: Response) => {

const user = await service.criarUsuario(req.body);

res.status(201).json(user);

};

// login
export const login = async (req: Request, res: Response) => {

const { email, senha } = req.body;

const user = await service.buscarPorEmail(email);

if (!user)

return res.status(404).json({ erro: "Usuário não existe" });

const valid = await bcrypt.compare(senha, user.senha);

if (!valid)

return res.status(401).json({ erro: "Senha inválida" });

const token = jwt.sign(

{ id: user.id },

SECRET,

{ expiresIn: "1d" }

);

res.json({

usuario: {

id: user.id,

nome: user.nome,

email: user.email

},

token

});

};

// listar
export const listar = async (req: Request, res: Response) => {

const users = await service.listarUsuarios();

res.json(users);

};

// deletar
export const deletar = async (req: Request, res: Response) => {

await service.deletarUsuario(Number(req.params.id));

res.json({ mensagem: "Deletado" });

};