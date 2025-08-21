import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { Client } from '../models/Client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secreta123';

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const user = (await Admin.findOne({ where: { email } })) || (await Client.findOne({ where: { email } }));
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const ok = await bcrypt.compare(senha, (user as any).senha);
    if (!ok) return res.status(401).json({ erro: 'Senha incorreta' });

    const tipo = (user instanceof Admin) ? 'admin' : 'cliente';
    const token = jwt.sign({ id: (user as any).id, email: (user as any).email, tipo }, secret, { expiresIn: '1h' });
    return res.json({ token });
  }

  async registrarAdmin(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const admin = await Admin.create({ nome, email, senha: senhaCriptografada, tipo: 'admin' });
    res.status(201).json(admin);
  }

  async registrarCliente(req: Request, res: Response) {
    const { nome, email, senha, telefone } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const cliente = await Client.create({ nome, email, senha: senhaCriptografada, telefone: telefone || '', tipo: 'cliente' });
    res.status(201).json(cliente);
  }
}
