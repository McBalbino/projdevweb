import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secreta123';

export const autenticarToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ mensagem: 'Token não fornecido' });

  try {
    const usuario = jwt.verify(token, secret);
    (req as any).usuario = usuario;
    next();
  } catch {
    return res.status(403).json({ mensagem: 'Token inválido' });
  }
};

export const autorizar = (tiposPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;
    if (!usuario || !tiposPermitidos.includes(usuario.tipo)) {
      return res.status(403).json({ mensagem: 'Acesso não autorizado' });
    }
    next();
  };
};
