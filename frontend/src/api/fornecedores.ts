
import { api } from './http'

export type Fornecedor = { id:number; nome:string; cnpj:string; email?:string; telefone?:string; endereco?:string }
export type ProdutoFornecedor = { id:number; fornecedorId:number; nome:string; sku:string; preco:number; ativo:boolean }

export type NovoFornecedorInput = { nome:string; cnpj:string; email?:string; telefone?:string; endereco?:string }
export type ProdutoFornecedorInput = { nome:string; sku:string; preco:number }

export const Fornecedores = {
  list: () => api.get<Fornecedor[]>('/fornecedores').then(r=>r.data),
  create: (data:NovoFornecedorInput) => api.post<Fornecedor>('/fornecedores', data).then(r=>r.data),
  update: (id:number, data:Partial<NovoFornecedorInput>) => api.put(`/fornecedores/${id}`, data).then(r=>r.data),
  remove: (id:number) => api.delete(`/fornecedores/${id}`).then(r=>r.data),
  listProdutos: (id:number) => api.get<ProdutoFornecedor[]>(`/fornecedores/${id}/produtos`).then(r=>r.data),
  addProduto: (id:number, data:ProdutoFornecedorInput) => api.post<ProdutoFornecedor>(`/fornecedores/${id}/produtos`, data).then(r=>r.data),
}
