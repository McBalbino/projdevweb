import { Client } from '../models/Client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secreta';

export class AuthService {
  static async register(data: { nome: string; email: string; senha: string; role: string }) {
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    //return await Client.create({ ...data, senha: hashedPassword });
  }

  static async login(email: string, senha: string) {
    const cliente = await Client.findOne({ where: { email } });
    if (!cliente) return null;

    const match = await bcrypt.compare(senha, cliente.senha);
    if (!match) return null;

    const token = jwt.sign({ id: cliente.id, role: cliente.role }, SECRET, { expiresIn: '1h' });
    return { token, cliente };
  }
}
