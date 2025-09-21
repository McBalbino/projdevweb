import { Request, Response } from 'express';
import { Animal, AnimalCreationAttributes } from '../models/Animal';

type ParsedIdade = { value: number | null } | { error: string };

const parseIdade = (raw: unknown): ParsedIdade => {
  if (raw === undefined) {
    return { value: null };
  }
  if (raw === null || raw === '') {
    return { value: null };
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return { error: 'Idade deve ser um número inteiro não negativo' };
  }
  return { value: Math.floor(parsed) };
};


export class AnimalController {
  private parseIdade(raw: unknown): { value: number | null } | { error: string } {
    if (raw === undefined) {
      return { value: null };
    }
    if (raw === null || raw === '') {
      return { value: null };
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { error: 'Idade deve ser um número inteiro não negativo' };
    }
    return { value: Math.floor(parsed) };
  }

  async create(req: Request, res: Response) {
    const usuario: any = (req as any).usuario;
    const idadeParse = parseIdade(req.body.idade);

    if ('error' in idadeParse) {
      return res.status(400).json({ erro: idadeParse.error });
    }
    const payload: AnimalCreationAttributes = {
      nome: req.body.nome,
      especie: req.body.especie,
      raca: req.body.raca,
      idade: idadeParse.value,
      clienteId: usuario?.tipo === 'cliente' ? Number(usuario.id) : Number(req.body.clienteId),
    };
    if (!payload.nome || !payload.especie || !payload.raca || !payload.clienteId) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, especie, raca, clienteId' });
    }
    const a = await Animal.create(payload);
    res.status(201).json(a);
  }
  async list(req: Request, res: Response) {
    const usuario: any = (req as any).usuario;
    const lst = await Animal.findAll(
      usuario?.tipo === 'admin'
        ? {}
        : { where: { clienteId: Number(usuario.id) } }
    );
    res.json(lst);
  }
  async show(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    const usuario: any = (req as any).usuario;
    if (usuario?.tipo !== 'admin' && a.clienteId !== Number(usuario.id)) {
      return res.status(403).json({ erro: 'Sem permissão para acessar este animal' });
    }
    res.json(a);
  }
  async update(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    const usuario: any = (req as any).usuario;
    if (usuario?.tipo !== 'admin' && a.clienteId !== Number(usuario.id)) {
      return res.status(403).json({ erro: 'Sem permissão para alterar este animal' });
    }

    const idadeProvided = Object.prototype.hasOwnProperty.call(req.body, 'idade');
    let idadeValor: number | null | undefined;
    if (idadeProvided) {
      const idadeParse = parseIdade(req.body.idade);

      if ('error' in idadeParse) {
        return res.status(400).json({ erro: idadeParse.error });
      }
      idadeValor = idadeParse.value;
    }
    const patch = usuario?.tipo === 'admin'
      ? {
          ...req.body,
          ...(idadeProvided ? { idade: idadeValor } : {}),
        }
      : {
          nome: req.body.nome ?? a.nome,
          especie: req.body.especie ?? a.especie,
          raca: req.body.raca ?? a.raca,
          idade: idadeProvided ? idadeValor ?? null : a.idade,

          clienteId: a.clienteId,
        };
    await a.update(patch);
    res.json(a);
  }
  async delete(req: Request, res: Response) {
    const a = await Animal.findByPk(Number(req.params.id));
    if (!a) return res.status(404).json({ erro: 'Animal não encontrado' });
    const usuario: any = (req as any).usuario;
    if (usuario?.tipo !== 'admin' && a.clienteId !== Number(usuario.id)) {
      return res.status(403).json({ erro: 'Sem permissão para remover este animal' });
    }
    await Animal.destroy({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Animal removido' });
  }
}
