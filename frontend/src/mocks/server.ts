
import AxiosMockAdapter from "axios-mock-adapter"
import type { AxiosInstance } from "axios"

type User = { id:number; nome:string; email:string; senha:string; telefone?:string; tipo:'admin'|'cliente' }
type Client = { id:number; nome:string; email:string; telefone:string; tipo:'cliente' }
type Animal = { id:number; nome:string; especie:'cachorro'|'gato'|'outro'; clienteId:number }
type Fornecedor = { id:number; nome:string; cnpj:string; email?:string; telefone?:string; endereco?:string }
type ProdutoFornecedor = { id:number; fornecedorId:number; nome:string; sku:string; preco:number; ativo:boolean }
type StatusPedido = 'ABERTO'|'APROVADO'|'ENVIADO'|'RECEBIDO'|'CANCELADO'
type PedidoCompraItem = { id:number; pedidoId:number; produtoFornecedorId:number; quantidade:number; precoUnitario:number; subtotal:number }
type PedidoCompra = { id:number; fornecedorId:number; adminId:number; status:StatusPedido; total:number; createdAt:string; updatedAt:string }

const nowISO = () => new Date().toISOString()
let uid = 1
const nextId = () => uid++

// Seed
const users: User[] = [
  { id: nextId(), nome: "Admin", email: "admin@petshop.com", senha: "123456", tipo: "admin" },
  { id: nextId(), nome: "Cliente", email: "cliente@petshop.com", senha: "123456", tipo: "cliente", telefone: "(83) 99999-0000" },
]
const clients: Client[] = [
  { id: nextId(), nome: "Ana Lima", email: "ana@exemplo.com", telefone: "(83) 9 9999-0001", tipo:'cliente' },
  { id: nextId(), nome: "Bruno Souza", email: "bruno@exemplo.com", telefone: "(83) 9 9999-0002", tipo:'cliente' },
]
const animais: Animal[] = [
  { id: nextId(), nome: "Thor", especie: "cachorro", clienteId: clients[0].id },
  { id: nextId(), nome: "Luna", especie: "gato", clienteId: clients[1].id },
]
const fornecedores: Fornecedor[] = [
  { id: nextId(), nome: "PetSupplies LTDA", cnpj: "12.345.678/0001-90", telefone:"(83) 3333-1212" },
  { id: nextId(), nome: "Rações do Norte", cnpj: "98.765.432/0001-10", telefone:"(83) 3333-4545" },
]
const produtosFornecedor: ProdutoFornecedor[] = [
  { id: nextId(), fornecedorId: fornecedores[0].id, nome: "Ração Premium 10kg", sku: "RAC-10", preco: 129.9, ativo: true },
  { id: nextId(), fornecedorId: fornecedores[0].id, nome: "Shampoo Canino 500ml", sku: "SHA-500", preco: 29.9, ativo: true },
  { id: nextId(), fornecedorId: fornecedores[1].id, nome: "Areia para Gatos 12kg", sku: "ARG-12", preco: 69.9, ativo: true },
]
const pedidos: PedidoCompra[] = []
const pedidoItens: PedidoCompraItem[] = []

function parseBody(data:any){ try { return typeof data === 'string' ? JSON.parse(data) : data } catch { return {} } }
function ok(data:any, status=200){ return [status, data] as const }
function err(message:string, status=400){ return [status, { message }] as const }

export function enableMock(api: AxiosInstance){
  const mock = new AxiosMockAdapter(api, { delayResponse: 400 })

  // AUTH
  mock.onPost('/auth/login').reply(config => {
    const { email, senha } = parseBody(config.data)
    const u = users.find(x => x.email === email && x.senha === senha)
    if (!u) return err('Credenciais inválidas', 401)
    return ok({ token: u.tipo === 'admin' ? 'mock-admin' : 'mock-cliente', id: u.id, nome: u.nome, email: u.email, tipo: u.tipo })
  })
  mock.onPost('/auth/registrar-cliente').reply(config => {
    const { nome, email, senha, telefone } = parseBody(config.data)
    if (!nome || !email || !senha) return err('nome, email e senha são obrigatórios', 400)
    if (users.some(u => u.email === email)) return err('email já cadastrado', 409)
    const id = nextId()
    users.push({ id, nome, email, senha, telefone, tipo:'cliente' })
    clients.push({ id: nextId(), nome, email, telefone, tipo:'cliente' })
    return ok({ id, nome, email, telefone }, 201)
  })

  // CLIENTS
  mock.onGet('/clients').reply(() => ok(clients))
  mock.onPost('/clients').reply(config => {
    const { nome, email, telefone } = parseBody(config.data)
    const c: Client = { id: nextId(), nome, email, telefone, tipo:'cliente' }
    clients.push(c); return ok(c, 201)
  })
  mock.onPut(/\/clients\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop())
    const body = parseBody(config.data)
    const idx = clients.findIndex(c=>c.id===id)
    if (idx<0) return err('cliente não encontrado', 404)
    clients[idx] = { ...clients[idx], ...body }; return ok(clients[idx])
  })
  mock.onDelete(/\/clients\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop())
    const i = clients.findIndex(c=>c.id===id)
    if (i<0) return err('cliente não encontrado', 404)
    clients.splice(i,1); return ok({ ok:true })
  })

  // ANIMAIS
  mock.onGet('/animais').reply(()=> ok(animais))
  mock.onPost('/animais').reply(config => {
    const { nome, especie, clienteId } = parseBody(config.data)
    const a: Animal = { id: nextId(), nome, especie, clienteId }
    animais.push(a); return ok(a, 201)
  })
  mock.onPut(/\/animais\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const body = parseBody(config.data)
    const i = animais.findIndex(a=>a.id===id); if(i<0) return err('animal não encontrado',404)
    animais[i] = { ...animais[i], ...body }; return ok(animais[i])
  })
  mock.onDelete(/\/animais\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const i = animais.findIndex(a=>a.id===id)
    if(i<0) return err('animal não encontrado',404); animais.splice(i,1); return ok({ok:true})
  })

  // FORNECEDORES
  mock.onGet('/fornecedores').reply(()=> ok(fornecedores))
  mock.onGet(/\/fornecedores\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const f = fornecedores.find(x=>x.id===id)
    if(!f) return err('fornecedor não encontrado',404); return ok(f)
  })
  mock.onPost('/fornecedores').reply(config => {
    const { nome, cnpj, email, telefone, endereco } = parseBody(config.data)
    const f: Fornecedor = { id: nextId(), nome, cnpj, email, telefone, endereco }
    fornecedores.push(f); return ok(f, 201)
  })
  mock.onPut(/\/fornecedores\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const body = parseBody(config.data)
    const i = fornecedores.findIndex(f=>f.id===id); if(i<0) return err('fornecedor não encontrado',404)
    fornecedores[i] = { ...fornecedores[i], ...body }; return ok(fornecedores[i])
  })
  mock.onDelete(/\/fornecedores\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const i = fornecedores.findIndex(f=>f.id===id)
    if(i<0) return err('fornecedor não encontrado',404); fornecedores.splice(i,1); return ok({ok:true})
  })

  // Catálogo do fornecedor
  mock.onGet(/\/fornecedores\/\d+\/produtos$/).reply(config => {
    const id = Number(config.url!.split('/')[2]); const lista = produtosFornecedor.filter(p=>p.fornecedorId===id && p.ativo!==false)
    return ok(lista)
  })
  mock.onPost(/\/fornecedores\/\d+\/produtos$/).reply(config => {
    const fornecedorId = Number(config.url!.split('/')[2]); const { nome, sku, preco } = parseBody(config.data)
    const p: ProdutoFornecedor = { id: nextId(), fornecedorId, nome, sku, preco, ativo:true }
    produtosFornecedor.push(p); return ok(p, 201)
  })
  mock.onPut(/\/produtos-fornecedor\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const body = parseBody(config.data)
    const i = produtosFornecedor.findIndex(p=>p.id===id); if(i<0) return err('produto fornecedor não encontrado',404)
    produtosFornecedor[i] = { ...produtosFornecedor[i], ...body }; return ok(produtosFornecedor[i])
  })
  mock.onDelete(/\/produtos-fornecedor\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const i = produtosFornecedor.findIndex(p=>p.id===id)
    if(i<0) return err('produto fornecedor não encontrado',404); produtosFornecedor[i].ativo = false; return ok({ok:true})
  })

  // PEDIDOS DE COMPRA
  mock.onPost('/pedidos-compra').reply(config => {
    const { fornecedorId, itens } = parseBody(config.data) as { fornecedorId:number; itens:{produtoFornecedorId:number; quantidade:number; precoUnitario?:number}[] }
    if (!fornecedorId || !Array.isArray(itens) || itens.length===0) return err('fornecedor e itens são obrigatórios',400)
    const id = nextId(); const createdAt = nowISO(); const updatedAt = nowISO()
    let total = 0
    itens.forEach((it:any)=>{
      const pf = produtosFornecedor.find(p=>p.id===it.produtoFornecedorId); if(!pf) return
      const preco = it.precoUnitario ?? pf.preco
      const subtotal = preco * (it.quantidade||1)
      total += subtotal
      pedidoItens.push({ id: nextId(), pedidoId:id, produtoFornecedorId:pf.id, quantidade:it.quantidade||1, precoUnitario:preco, subtotal })
    })
    const pedido: PedidoCompra = { id, fornecedorId, adminId: 1, status:'ABERTO', total, createdAt, updatedAt }
    pedidos.push(pedido)
    return ok(pedido, 201)
  })
  mock.onGet('/pedidos-compra').reply(()=> ok(pedidos))
  mock.onGet(/\/pedidos-compra\/\d+$/).reply(config => {
    const id = Number(config.url!.split('/').pop()); const p = pedidos.find(x=>x.id===id)
    if(!p) return err('pedido não encontrado',404); return ok(p)
  })
  mock.onPatch(/\/pedidos-compra\/\d+\/status$/).reply(config => {
    const id = Number(config.url!.split('/')[2]); const { status } = parseBody(config.data) as { status: StatusPedido }
    const i = pedidos.findIndex(p=>p.id===id); if(i<0) return err('pedido não encontrado',404)
    pedidos[i].status = status; pedidos[i].updatedAt = nowISO(); return ok(pedidos[i])
  })
  mock.onPost(/\/pedidos-compra\/\d+\/receber$/).reply(config => {
    const id = Number(config.url!.split('/')[2]); const i = pedidos.findIndex(p=>p.id===id); if(i<0) return err('pedido não encontrado',404)
    pedidos[i].status = 'RECEBIDO'; pedidos[i].updatedAt = nowISO(); return ok(pedidos[i])
  })

  mock.onAny().reply(config => {
    return err(`Rota mock não definida: ${config.method?.toUpperCase()} ${config.url}`, 404)
  })

  return mock
}
