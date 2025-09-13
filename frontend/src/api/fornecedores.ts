
import { api } from './http'
export type Fornecedor = { id:number; nome:string; cnpj:string; email?:string; telefone?:string; endereco?:string }
export type ProdutoFornecedor = { id:number; fornecedorId:number; nome:string; sku:string; preco:number; ativo:boolean }
export const Fornecedores = {
  list: () => api.get<Fornecedor[]>('/fornecedores').then(r=>r.data),
  get: (id:number) => api.get<Fornecedor>(`/fornecedores/${id}`).then(r=>r.data),
  create: (f: Partial<Fornecedor>) => api.post<Fornecedor>('/fornecedores', f).then(r=>r.data),
  update: (id:number, f: Partial<Fornecedor>) => api.put<Fornecedor>(`/fornecedores/${id}`, f).then(r=>r.data),
  remove: (id:number) => api.delete(`/fornecedores/${id}`),
  addProduto: (id:number, p: Partial<ProdutoFornecedor>) => api.post<ProdutoFornecedor>(`/fornecedores/${id}/produtos`, p).then(r=>r.data),
  listProdutos: (id:number) => api.get<ProdutoFornecedor[]>(`/fornecedores/${id}/produtos`).then(r=>r.data),
  updateProdutoFornecedor: (id:number, p: Partial<ProdutoFornecedor>) => api.put(`/produtos-fornecedor/${id}`, p),
  desativarProdutoFornecedor: (id:number) => api.delete(`/produtos-fornecedor/${id}`),
}
