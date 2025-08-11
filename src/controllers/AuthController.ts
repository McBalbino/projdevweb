import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { Client } from '../models/Client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secreta123';

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const user = await Admin.findOne({ where: { email } }) || await Client.findOne({ where: { email } });

    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, (user as any).senha);

    if (!senhaCorreta) return res.status(401).json({ erro: 'Senha incorreta' });

    const tipo = 'nome' in user && 'telefone' in user ? 'cliente' : 'admin';

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo },
      secret,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  }


  async registrarAdmin(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const admin = await Admin.create({ nome, email, senha: senhaCriptografada });
    res.status(201).json(admin);
  }

  async registrarCliente(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const cliente = await Client.create({
        nome, email, senha: senhaCriptografada,
        telefone: ''
    });
    res.status(201).json(cliente);
  }


}
