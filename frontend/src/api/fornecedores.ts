
import { api } from './http'
export type Fornecedor = { id:number; nome:string; cnpj:string; email?:string; telefone?:string; endereco?:string }
export type ProdutoFornecedor = { id:number; fornecedorId:number; nome:string; sku:string; preco:number; ativo:boolean }
export const Fornecedores = {
  list: () => api.get<Fornecedor[]>('/fornecedores').then(r=>r.data),
  listProdutos: (id:number) => api.get<ProdutoFornecedor[]>(`/fornecedores/${id}/produtos`).then(r=>r.data),
}
