
import React, { useState } from 'react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PawPrint, Users, Building2, Calendar, Search, LogOut, Shield } from 'lucide-react'
import { Clients } from '@/api/clients'
import type { Client } from '@/api/clients'
import { Animais } from '@/api/animais'
import type { Animal } from '@/api/animais'

import { Fornecedores } from '@/api/fornecedores'
import type { Fornecedor, ProdutoFornecedor } from '@/api/fornecedores'
import { Pedidos } from '@/api/pedidos'
import type { PedidoCompra, StatusPedido } from '@/api/pedidos'
import { Consultas } from '@/api/consultas'
import type { Consulta } from '@/api/consultas'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const formatISODateForInput = (value?: string) => {

  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

const normalizeDateInputToISO = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  const base = trimmed.includes('T') ? trimmed : `${trimmed}T12:00:00`
  const parsed = new Date(base)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString()
}

function AppShell(){ const { user, logout } = useAuth(); return (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><PawPrint className="h-7 w-7 text-emerald-600"/>Petshop</h1>
      <p className="text-gray-500 flex items-center gap-2">Conectado • <Badge variant="default" className="ml-1">{user?.tipo?.toUpperCase()}</Badge></p>
    </div>
    <Button variant="outline" className="gap-2" onClick={logout}><LogOut className="h-4 w-4"/>Sair</Button>
  </div>
)}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (<div className="relative w-full max-w-sm">
    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "Buscar..."} className="pl-8" />
  </div>)
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (<div className="min-h-screen w-full flex items-center justify-center bg-pet-auth p-4"><div className="w-full max-w-md">{children}</div></div>)
}



function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !senha) return toast.error('Informe e-mail e senha')
    try {
      setLoading(true)
      await login(email, senha)
      toast.success('Bem-vindo(a)!')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.response?.data?.erro || e?.message || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <Card className="rounded-2xl shadow-xl backdrop-blur bg-white/95">
      <CardHeader className="card-header-grad rounded-t-2xl">
        <CardTitle className="text-white">Entrar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="grid gap-2">
          <Label>Senha</Label>
          <Input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <Button className="w-full" onClick={submit} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        <p className="text-sm text-gray-500 text-center">
          Não tem conta? <button className="underline" onClick={onSwitch}>Cadastre-se</button>
        </p>
      </CardContent>
    </Card>
  )
}


function SignupForm({ onSwitch }: { onSwitch: () => void }){
  const { signup } = useAuth()
  const [role,setRole]=useState<'admin'|'cliente'>('cliente')
  const [nome,setNome]=useState(''); const [email,setEmail]=useState(''); const [senha,setSenha]=useState(''); const [tel,setTel]=useState('')
  const submit = async()=>{
    if (!nome || !email || !senha) { toast.error('Preencha todos os campos obrigatórios'); return }
    try{ await signup(role, nome, email, senha, tel); toast.success('Conta criada. Faça login.'); onSwitch() }catch(e:any){ toast.error(e?.message || 'Falha no cadastro'); console.error('Signup error:', e) }
  }
  return (<Card className="rounded-2xl shadow-xl backdrop-blur bg-white/95">
    <CardHeader className="card-header-grad rounded-t-2xl">
      <CardTitle className="text-white">Criar conta</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-2">
        <Label>Tipo de usuário</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant={role==='cliente'?'default':'outline'} onClick={()=>setRole('cliente')}>Cliente</Button>
          <Button variant={role==='admin'?'default':'outline'} onClick={()=>setRole('admin')} className="gap-2"><Shield className="h-4 w-4"/>Admin</Button>
        </div>
      </div>
      <div className="grid gap-2"><Label>Nome</Label><Input value={nome} onChange={e=>setNome(e.target.value)}/></div>
      <div className="grid gap-2"><Label>E-mail</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      {role==='cliente' && <div className="grid gap-2"><Label>Telefone</Label><Input value={tel} onChange={e=>setTel(e.target.value)}/></div>}
      <div className="grid gap-2"><Label>Senha</Label><Input type="password" value={senha} onChange={e=>setSenha(e.target.value)}/></div>
      <Button className="w-full" onClick={submit}>Cadastrar</Button>
      <p className="text-sm text-gray-500 text-center">Já tem conta? <button className="underline" onClick={onSwitch}>Entrar</button></p>
    </CardContent>
  </Card>)
}

function AuthGate({ children }:{children:React.ReactNode}){
  const { user } = useAuth()
  const [isSignup,setIsSignup]=useState(false)
  if (!user) return <AuthLayout>{!isSignup ? <LoginForm onSwitch={()=>setIsSignup(true)} /> : <SignupForm onSwitch={()=>setIsSignup(false)} />}</AuthLayout>
  return <>{children}</>
}

function DashboardPage(){
  const { user } = useAuth()
  const isAdmin = user?.tipo === 'admin'

  const sections: { title: string; description: string }[] = isAdmin
    ? [
        { title: 'Pedidos', description: 'Acompanhe solicitações de compra, atualize o status e registre recebimentos.' },
        { title: 'Fornecedores', description: 'Cadastre novos parceiros, revise contatos e organize o catálogo de produtos.' },
        { title: 'Animais', description: 'Visualize os pets cadastrados e confirme os vínculos com cada cliente.' },
        { title: 'Clientes', description: 'Mantenha os dados dos clientes atualizados para facilitar os atendimentos.' },
        { title: 'Consultas (agendadas)', description: 'Veja os agendamentos, confirme horários e acompanhe o andamento de cada consulta.' },
      ]
    : [
        { title: 'Meus Animais', description: 'Cadastre, edite e acompanhe as informações dos seus pets.' },
        { title: 'Consultas', description: 'Solicite novos agendamentos e acompanhe o andamento dos pedidos enviados.' },
        { title: 'Histórico', description: 'Revise consultas finalizadas e mantenha um registro dos atendimentos anteriores.' },
      ]

  const intro = isAdmin
    ? 'Gerencie as operações do petshop por aqui. Use as abas acima para acompanhar pedidos, fornecedores, animais, clientes e as consultas agendadas.'
    : 'Bem-vindo(a) de volta! Use as abas acima para cuidar dos seus pets, solicitar consultas e consultar seus atendimentos anteriores.'

  const tip = isAdmin
    ? 'Dica: mantenha cadastros e status atualizados para que toda a equipe tenha uma visão clara das prioridades do dia.'
    : 'Dica: revise os dados do pet antes de agendar uma nova consulta para que a equipe possa preparar o melhor atendimento.'

  return (<Card className="rounded-2xl">
    <CardHeader className="card-header-grad rounded-t-2xl">
      <CardTitle className="text-white">Bem-vindo(a) ao Petshop</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
      <p className="text-gray-600 leading-relaxed">{intro}</p>
      <div className="space-y-2">
        <p className="font-medium text-foreground">Seções disponíveis</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          {sections.map((section) => (
            <li key={section.title}>
              <span className="font-medium text-foreground">{section.title}:</span> {section.description}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-gray-500">{tip}</p>
    </CardContent>
  </Card>)
}

function ClientesPage(){
  const [list,setList]=useState<any[]>([]); const [q,setQ]=useState('')
  const refresh = async()=> setList(await Clients.list())
  React.useEffect(()=>{ refresh().catch(()=>toast.error('Falha ao carregar clientes')) },[])
  const filtered = list.filter((c)=>`${c.nome} ${c.email} ${c.telefone}`.toLowerCase().includes(q.toLowerCase()))
  return (<>
    <div className="flex items-center justify-between gap-2 py-2"><SearchBox value={q} onChange={setQ} placeholder="Buscar por nome, e-mail, telefone" /></div>
    <Card className="rounded-2xl"><CardContent className="p-0">
      <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Telefone</TableHead></TableRow></TableHeader>
      <TableBody>{filtered.map((c)=>(<TableRow key={c.id}><TableCell className="font-medium">{c.nome}</TableCell><TableCell>{c.email}</TableCell><TableCell>{c.telefone}</TableCell></TableRow>))}</TableBody></Table>
    </CardContent></Card>
  </>)
}

function AnimaisPage(){
  const [list,setList]=useState<any[]>([])
  const [q,setQ]=useState('')

  React.useEffect(()=>{
    Animais.list().then(setList).catch(()=>toast.error('Falha ao carregar animais'))
  },[])

  return (
    <Card className="rounded-2xl">
      <CardHeader className="card-header-grad rounded-t-2xl">
        <CardTitle className="text-white">Animais cadastrados</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-3">
          <SearchBox value={q} onChange={setQ} placeholder="Buscar por nome ou espécie" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Espécie</TableHead>
              <TableHead>Raça</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Cliente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list
              .filter(a => `${a.nome} ${a.especie} ${a.raca}`.toLowerCase().includes(q.toLowerCase()))
              .map((a:any)=>(
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell className="font-medium">{a.nome}</TableCell>
                  <TableCell className="capitalize">{a.especie}</TableCell>
                  <TableCell className="capitalize">{a.raca}</TableCell>
                  <TableCell>{a.idade ?? '—'}</TableCell>
                  <TableCell>{a.clienteId}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


function FornecedoresPage(){
  const { user } = useAuth()
  const isAdmin = user?.tipo === 'admin'
  const [list, setList] = useState<Fornecedor[]>([])
  const [q, setQ] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [catalogo, setCatalogo] = useState<ProdutoFornecedor[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [savingFornecedor, setSavingFornecedor] = useState(false)
  const [createForm, setCreateForm] = useState(() => ({ nome:'', cnpj:'', email:'', telefone:'', endereco:'' }))
  const [productForm, setProductForm] = useState(() => ({ nome:'', sku:'', preco:'' }))
  const [savingProduct, setSavingProduct] = useState(false)
  const brl = React.useMemo(() => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }), [])

  const resetCreateForm = React.useCallback(() => {
    setCreateForm({ nome:'', cnpj:'', email:'', telefone:'', endereco:'' })
  }, [])
  const resetProductForm = React.useCallback(() => {
    setProductForm({ nome:'', sku:'', preco:'' })
  }, [])

  const refresh = React.useCallback(async () => {
    try {
      const fornecedores = await Fornecedores.list()
      setList(fornecedores)
      if (fornecedores.length === 0) {
        setSelectedId(null)
        setCatalogo([])
        return
      }
      setSelectedId(prev => {
        if (prev && fornecedores.some(f => f.id === prev)) {
          return prev
        }
        return fornecedores[0].id
      })
    } catch (e: any) {
      console.error('Erro ao carregar fornecedores', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Falha ao carregar fornecedores')
      setList([])
      setSelectedId(null)
      setCatalogo([])
    }
  }, [])

  React.useEffect(() => { void refresh() }, [refresh])

  React.useEffect(() => {
    if (selectedId == null) {
      setCatalogo([])
      return
    }
    let ativo = true
    const load = async () => {
      try {
        const itens = await Fornecedores.listProdutos(selectedId)
        if (ativo) setCatalogo(itens)
      } catch (e: any) {
        console.error('Erro ao carregar catálogo do fornecedor', e)
        if (ativo) {
          toast.error(e?.response?.data?.erro || e?.message || 'Falha ao carregar catálogo do fornecedor')
          setCatalogo([])
        }
      }
    }
    void load()
    return () => { ativo = false }
  }, [selectedId])

  const filtered = React.useMemo(
    () => list.filter(f => `${f.nome} ${f.cnpj}`.toLowerCase().includes(q.toLowerCase())),
    [list, q]
  )
  const selected = selectedId != null ? list.find(f => f.id === selectedId) ?? null : null

  const createFornecedor = async () => {
    const payload = {
      nome: createForm.nome.trim(),
      cnpj: createForm.cnpj.trim(),
      email: createForm.email.trim() || undefined,
      telefone: createForm.telefone.trim() || undefined,
      endereco: createForm.endereco.trim() || undefined,
    }
    if (!payload.nome || !payload.cnpj) {
      toast.error('Informe nome e CNPJ do fornecedor')
      return
    }
    try {
      setSavingFornecedor(true)
      const novo = await Fornecedores.create(payload)
      toast.success('Fornecedor cadastrado com sucesso')
      setCreateOpen(false)
      resetCreateForm()
      await refresh()
      setSelectedId(novo.id)
    } catch (e: any) {
      console.error('Erro ao criar fornecedor', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Falha ao criar fornecedor')
    } finally {
      setSavingFornecedor(false)
    }
  }

  const adicionarProduto = async () => {
    if (selectedId == null) {
      toast.error('Selecione um fornecedor para adicionar produtos')
      return
    }
    const nome = productForm.nome.trim()
    const sku = productForm.sku.trim()
    const precoValor = Number(productForm.preco)
    if (!nome || !sku || !productForm.preco) {
      toast.error('Informe nome, SKU e preço do produto')
      return
    }
    if (!Number.isFinite(precoValor) || precoValor <= 0) {
      toast.error('Informe um preço válido')
      return
    }
    try {
      setSavingProduct(true)
      await Fornecedores.addProduto(selectedId, { nome, sku, preco: precoValor })
      toast.success('Produto adicionado ao catálogo')
      resetProductForm()
      const itens = await Fornecedores.listProdutos(selectedId)
      setCatalogo(itens)
    } catch (e: any) {
      console.error('Erro ao adicionar produto ao fornecedor', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Falha ao adicionar produto')
    } finally {
      setSavingProduct(false)
    }
  }

  const removerFornecedor = async () => {
    if (!selected) return
    if (typeof window !== 'undefined' && !window.confirm(`Remover o fornecedor ${selected.nome}?`)) return
    try {
      await Fornecedores.remove(selected.id)
      toast.success('Fornecedor removido')
      await refresh()
      resetProductForm()
    } catch (e: any) {
      console.error('Erro ao remover fornecedor', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Falha ao remover fornecedor')
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <Card className="rounded-2xl">
        <CardHeader className="card-header-grad rounded-t-2xl">
          <CardTitle className="text-white">Fornecedores</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-2 p-3">
            <SearchBox value={q} onChange={setQ} placeholder="Buscar por nome ou CNPJ" />
            {isAdmin && (
              <Dialog
                open={createOpen}
                onOpenChange={open => {
                  setCreateOpen(open)
                  if (!open) {
                    resetCreateForm()
                    setSavingFornecedor(false)
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">Novo fornecedor</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo fornecedor</DialogTitle>
                    <DialogDescription>Cadastre um novo parceiro para disponibilizar produtos no catálogo.</DialogDescription>
                  </DialogHeader>
                  <div className="p-4 pt-0 space-y-3">
                    <div className="grid gap-1">
                      <Label>Nome</Label>
                      <Input value={createForm.nome} onChange={e => setCreateForm(prev => ({ ...prev, nome: e.target.value }))} />
                    </div>
                    <div className="grid gap-1">
                      <Label>CNPJ</Label>
                      <Input value={createForm.cnpj} onChange={e => setCreateForm(prev => ({ ...prev, cnpj: e.target.value }))} />
                    </div>
                    <div className="grid gap-1">
                      <Label>E-mail</Label>
                      <Input type="email" value={createForm.email} onChange={e => setCreateForm(prev => ({ ...prev, email: e.target.value }))} />
                    </div>
                    <div className="grid gap-1">
                      <Label>Telefone</Label>
                      <Input value={createForm.telefone} onChange={e => setCreateForm(prev => ({ ...prev, telefone: e.target.value }))} />
                    </div>
                    <div className="grid gap-1">
                      <Label>Endereço</Label>
                      <Input value={createForm.endereco} onChange={e => setCreateForm(prev => ({ ...prev, endereco: e.target.value }))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" type="button" onClick={() => setCreateOpen(false)}>Cancelar</Button>
                    <Button onClick={createFornecedor} disabled={savingFornecedor}>
                      {savingFornecedor ? 'Salvando...' : 'Salvar fornecedor'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="w-40 text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-sm text-gray-500">
                    Nenhum fornecedor encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(f => (
                  <TableRow
                    key={f.id}
                    className={`cursor-pointer ${selectedId === f.id ? 'bg-emerald-50' : ''}`}
                    onClick={() => setSelectedId(f.id)}
                  >
                    <TableCell className="font-medium">{f.nome}</TableCell>
                    <TableCell>{f.cnpj}</TableCell>
                    <TableCell className="text-right text-xs text-emerald-700">
                      {selectedId === f.id ? 'Selecionado' : 'Ver detalhes'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader className="card-header-grad rounded-t-2xl">
          <CardTitle className="text-white">Detalhes do fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selected ? (
            <p className="text-sm text-gray-500">Selecione um fornecedor para visualizar contato e catálogo.</p>
          ) : (
            <>
              <div className="space-y-1">
                <div>
                  <p className="text-lg font-semibold text-emerald-800">{selected.nome}</p>
                  <p className="text-sm text-gray-500">CNPJ: {selected.cnpj}</p>
                </div>
                {selected.email && <p className="text-sm text-gray-500">E-mail: {selected.email}</p>}
                {selected.telefone && <p className="text-sm text-gray-500">Telefone: {selected.telefone}</p>}
                {selected.endereco && <p className="text-sm text-gray-500">Endereço: {selected.endereco}</p>}
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Catálogo ativo</div>
                {catalogo.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum produto cadastrado para este fornecedor.</p>
                ) : (
                  <div className="max-h-48 overflow-auto border rounded-xl divide-y">
                    {catalogo.map(prod => (
                      <div key={prod.id} className="flex items-center justify-between p-2 text-sm">
                        <div>
                          <div className="font-medium">{prod.nome}</div>
                          <div className="text-xs text-gray-500">{prod.sku}</div>
                        </div>
                        <div className="font-semibold text-emerald-700">{brl.format(Number(prod.preco ?? 0))}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {isAdmin && (
                <div className="space-y-3 border-t pt-3">
                  <div className="text-sm font-medium text-gray-600">Adicionar produto ao catálogo</div>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label>Nome</Label>
                      <Input value={productForm.nome} onChange={e => setProductForm(prev => ({ ...prev, nome: e.target.value }))} />
                    </div>
                    <div className="grid gap-1">
                      <Label>SKU</Label>
                      <Input value={productForm.sku} onChange={e => setProductForm(prev => ({ ...prev, sku: e.target.value }))} />
                    </div>
                    <div className="grid gap-1">
                      <Label>Preço</Label>
                      <Input type="number" min={0} step="0.01" value={productForm.preco} onChange={e => setProductForm(prev => ({ ...prev, preco: e.target.value }))} />
                    </div>
                    <Button onClick={adicionarProduto} disabled={savingProduct}>
                      {savingProduct ? 'Salvando...' : 'Adicionar produto'}
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm" onClick={removerFornecedor}>Remover fornecedor</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PedidosPage(){
  const { user } = useAuth()
  const isAdmin = user?.tipo === 'admin'
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [fornecedorId, setFornecedorId] = useState<number | undefined>()
  const [catalogo, setCatalogo] = useState<ProdutoFornecedor[]>([])
  const [itens, setItens] = useState<{produtoFornecedorId:number; quantidade:number; precoUnitario?:number}[]>([])
  const brl = React.useMemo(() => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }), [])

  const refresh = React.useCallback(async () => {
    try {
      const listaFornecedores = await Fornecedores.list()
      setFornecedores(listaFornecedores)
    } catch (e: any) {
      console.error('Erro ao carregar fornecedores', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Falha ao carregar fornecedores')
      setFornecedores([])
    }
    if (isAdmin) {
      try {
        const listaPedidos = await Pedidos.list()
        setPedidos(listaPedidos)
      } catch (e: any) {
        console.error('Erro ao carregar pedidos', e)
        toast.error(e?.response?.data?.erro || e?.message || 'Falha ao carregar pedidos')
        setPedidos([])
      }
    } else {
      setPedidos([])
    }
  }, [isAdmin])

  React.useEffect(() => { void refresh() }, [refresh])

  React.useEffect(() => {
    if (!fornecedorId) return
    if (!fornecedores.some(f => f.id === fornecedorId)) {
      setFornecedorId(undefined)
      setCatalogo([])
      setItens([])
    }
  }, [fornecedores, fornecedorId])

  const loadCatalogo = async (id:number) => {
    setFornecedorId(id)
    setItens([])
    try {
      const prods = await Fornecedores.listProdutos(id)
      setCatalogo(prods)
    } catch (e: any) {
      console.error('Erro ao carregar catálogo para pedido', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Falha ao carregar catálogo do fornecedor')
      setCatalogo([])
    }
  }

  const handleFornecedorChange = (value:string) => {
    const id = Number(value)
    if (Number.isNaN(id)) return
    void loadCatalogo(id)
  }

  const addItem = (produtoFornecedorId:number) => {
    setItens(prev => [...prev, { produtoFornecedorId, quantidade:1 }])
  }

  const removeItem = (index:number) => {
    setItens(prev => prev.filter((_, i) => i !== index))
  }

  const createPedido = async () => {
    if (!fornecedorId || itens.length === 0) {
      toast.error('Selecione fornecedor e itens')
      return
    }
    try {
      await Pedidos.create(fornecedorId, itens)
      toast.success('Pedido criado')
      setItens([])
      setCatalogo([])
      setFornecedorId(undefined)
      await refresh()
    } catch (e: any) {
      console.error('Erro ao criar pedido', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Falha ao criar pedido')
    }
  }

  const atualizarStatus = async (id:number, status:StatusPedido) => {
    try {
      await Pedidos.setStatus(id, status)
      toast.success('Status atualizado')
      await refresh()
    } catch (e: any) {
      console.error('Erro ao atualizar status do pedido', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Não foi possível atualizar o status')
    }
  }

  const receber = async (id:number) => {
    try {
      await Pedidos.receber(id)
      toast.success('Pedido recebido')
      await refresh()
    } catch (e: any) {
      console.error('Erro ao receber pedido', e)
      toast.error(e?.response?.data?.erro || e?.message || 'Não foi possível receber o pedido')
    }
  }

  const fornecedorPorId = React.useMemo(() => {
    const map = new Map<number, string>()
    fornecedores.forEach(f => map.set(f.id, f.nome))
    return map
  }, [fornecedores])

  const catalogoPorId = React.useMemo(() => {
    const map = new Map<number, ProdutoFornecedor>()
    catalogo.forEach(prod => map.set(prod.id, prod))
    return map
  }, [catalogo])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Novo Pedido de Compra</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Label>Fornecedor</Label>
            <div className="relative">
              <Select value={typeof fornecedorId === 'number' ? String(fornecedorId) : undefined} onValueChange={handleFornecedorChange}>
                <SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger>
                <SelectContent>{fornecedores.map(f => (<SelectItem key={f.id} value={String(f.id)}>{f.nome}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          {catalogo.length>0 && (
            <div className="border rounded-xl p-2 max-h-48 overflow-auto">
              <div className="text-sm mb-2 text-gray-500">Catálogo</div>
              {catalogo.map(p => (
                <div key={p.id} className="flex items-center justify-between py-1">
                  <div className="text-sm">{p.nome} • {p.sku} • {brl.format(Number(p.preco ?? 0))}</div>
                  {isAdmin ? <Button variant="secondary" onClick={()=>addItem(p.id)}>Adicionar</Button> : <span className="text-xs text-gray-400">Sem permissão</span>}
                </div>
              ))}
            </div>
          )}
          {itens.length>0 && (
            <div className="border rounded-xl p-2 space-y-2">
              <div className="text-sm text-gray-500">Itens do pedido</div>
              {itens.map((it,idx)=>{
                const prod = catalogoPorId.get(it.produtoFornecedorId)
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm flex-1">{prod ? `${prod.nome} (${prod.sku})` : `Produto #${it.produtoFornecedorId}`}</span>
                    <Input type="number" min={1} value={it.quantidade} onChange={e=>{
                      const q = Number(e.target.value) || 1
                      setItens(prev=>prev.map((p,i)=>i===idx?{...p, quantidade:q}:p))
                    }} className="w-24"/>
                    <Button variant="ghost" size="sm" onClick={()=>removeItem(idx)}>Remover</Button>
                  </div>
                )
              })}
            </div>
          )}
          {isAdmin ? <Button onClick={createPedido} className="w-full">Criar Pedido</Button> : <p className="text-xs text-gray-500">Clientes podem visualizar, mas não criar pedidos.</p>}
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Pedidos</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-64">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-sm text-gray-500">Nenhum pedido cadastrado.</TableCell>
                </TableRow>
              ) : (
                pedidos.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{fornecedorPorId.get(p.fornecedorId) || p.fornecedorId}</TableCell>
                    <TableCell><Badge variant="default">{p.status}</Badge></TableCell>
                    <TableCell className="flex flex-wrap gap-2 py-2">
                      {isAdmin ? (
                        <>
                          <Button variant="secondary" onClick={()=>atualizarStatus(p.id,'APROVADO')}>Aprovar</Button>
                          <Button variant="secondary" onClick={()=>atualizarStatus(p.id,'ENVIADO')}>Enviar</Button>
                          <Button variant="secondary" onClick={()=>receber(p.id)}>Receber</Button>
                        </>
                      ) : <span className="text-xs text-gray-400">Somente leitura</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}




function AdminConsultasPage(){
  const [list,setList]=useState<any[]>([])
  const [animals,setAnimals]=useState<Animal[]>([])
  const [clients,setClients]=useState<Client[]>([])
  const [editRow,setEditRow]=useState<any|null>(null)
  React.useEffect(()=>{
    const load = async()=>{
      try{
        const [consultas, animais, clientes] = await Promise.all([Consultas.list(), Animais.list(), Clients.list()])
        setList(consultas)
        setAnimals(animais)
        setClients(clientes)
      }catch(e){
        console.error('Erro ao carregar consultas, animais ou clientes', e)
        toast.error('Falha ao carregar consultas')
      }
    }
    load()
  },[])
  const br = new Intl.DateTimeFormat('pt-BR', { dateStyle:'short' })
  const save = async()=>{
    if(!editRow) return
    const tipo = (editRow.tipo || '').trim()
    if (!tipo || !editRow.data) {
      toast.error('Preencha tipo e data')
      return
    }
    await Consultas.update(editRow.id, { ...editRow, tipo })
    toast.success('Consulta atualizada')
    setEditRow(null)
    setList(await Consultas.list())
  }
  const remove = async(id:number)=>{ await Consultas.remove(id); toast.success('Consulta excluída'); setList(await Consultas.list()) }
  const setStatus = async(id:number, status:'AGENDADA'|'CONCLUIDA'|'CANCELADA')=>{ await Consultas.update(id, { status }); toast.success('Status atualizado'); setList(await Consultas.list()) }
  const badge = (s:string)=> s==='CONCLUIDA' ? 'badge-primary' : s==='CANCELADA' ? 'bg-red-600 text-white' : 'badge-accent'
  const animalNomePorId = React.useMemo(() => {
    const map = new Map<number, string>()
    animals.forEach((animal)=>{
      map.set(animal.id, animal.nome)
    })
    return map
  }, [animals])
  const clienteNomePorId = React.useMemo(() => {
    const map = new Map<number, string>()
    clients.forEach((cliente)=>{
      map.set(cliente.id, cliente.nome)
    })
    return map
  }, [clients])
  return (<Card className="rounded-2xl"><CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Consultas agendadas</CardTitle></CardHeader>
    <CardContent className="p-0">
      <Table><TableHeader><TableRow><TableHead>#</TableHead><TableHead>Cliente</TableHead><TableHead>Animal</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead className="w-64">Ações</TableHead></TableRow></TableHeader>
      <TableBody>{list.map((c:any)=>(<TableRow key={c.id}>
        <TableCell>{c.id}</TableCell><TableCell>{clienteNomePorId.get(c.clienteId) || `#${c.clienteId}`}</TableCell><TableCell>{animalNomePorId.get(c.animalId) || `#${c.animalId}`}</TableCell>
        <TableCell>{c.tipo}</TableCell><TableCell>{br.format(new Date(c.data))}</TableCell>
        <TableCell><span className={`px-2 py-1 rounded-full text-xs ${badge(c.status)}`}>{c.status}</span></TableCell>
        <TableCell className="flex gap-2">
          <Button variant="secondary" onClick={()=>setEditRow({...c})}>Editar</Button>
          <Button variant="outline" onClick={()=>setStatus(c.id,'CONCLUIDA')}>Concluir</Button>
          <Button variant="outline" onClick={()=>setStatus(c.id,'CANCELADA')}>Cancelar</Button>
          <Button variant="destructive" onClick={()=>remove(c.id)}>Excluir</Button>
        </TableCell>
      </TableRow>))}</TableBody></Table>
      {editRow && <div className="p-4 border-t grid md:grid-cols-5 gap-2">
        <Input value={editRow.tipo} onChange={e=>setEditRow({...editRow, tipo:e.target.value})} placeholder="Tipo"/>
        <Input
          type="date"

          value={formatISODateForInput(editRow.data)}
          onChange={e=>{
            const iso = normalizeDateInputToISO(e.target.value)
            setEditRow({ ...editRow, data: iso })
          }}
        />
        <Input value={editRow.observacoes||''} onChange={e=>setEditRow({...editRow, observacoes:e.target.value})} placeholder="Observações"/>
        <Select value={editRow.status} onValueChange={(v:any)=>setEditRow({...editRow, status:v})}>
          <SelectTrigger><SelectValue placeholder="Status"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="AGENDADA">AGENDADA</SelectItem>
            <SelectItem value="CONCLUIDA">CONCLUIDA</SelectItem>
            <SelectItem value="CANCELADA">CANCELADA</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2"><Button onClick={save}>Salvar</Button><Button variant="ghost" onClick={()=>setEditRow(null)}>Cancelar</Button></div>
      </div>}
    </CardContent></Card>)
}

function ClienteConsultasPage(){
  const { user } = useAuth()
  const [list,setList]=useState<any[]>([])
  const [form,setForm]=useState<{animalId:string; tipo:string; data:string; observacoes?:string}>({animalId:'', tipo:'', data:'', observacoes:''})
  const [myAnimals, setMyAnimals] = useState<Animal[]>([])
  React.useEffect(()=>{
    if(!user) return
    const load = async()=>{
      try{
        const [animals, consultas] = await Promise.all([
          Animais.listMine(user.id),
          Consultas.listMine(user.id)
        ])
        setMyAnimals(animals)
        setList(consultas)
      }catch(e){
        console.error('Erro ao carregar dados de consultas:', e)
        toast.error('Falha ao carregar consultas')
      }
    }
    load()
  },[user])
  const br = new Intl.DateTimeFormat('pt-BR', { dateStyle:'short' })
  const animalNomePorId = React.useMemo(() => {
    const map = new Map<number, string>()
    myAnimals.forEach((animal)=>{
      map.set(animal.id, animal.nome)
    })
    return map
  }, [myAnimals])
  const create = async()=>{
    if(!user) return
    if (!form.animalId) {
      toast.error('Selecione um animal')
      return
    }
    const animalId = Number(form.animalId)
    if (!Number.isFinite(animalId) || animalId <= 0) {
      toast.error('Selecione um animal válido')
      return
    }
    const tipo = form.tipo.trim()
    const rawDate = form.data.trim()
    if (!tipo || !rawDate) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    const isoDate = normalizeDateInputToISO(rawDate)
    if (!isoDate) {
      toast.error('Informe uma data válida')
      return
    }
    try{
      await Consultas.create({ clienteId:user.id, animalId, tipo, data: isoDate, observacoes: form.observacoes?.trim() || undefined })
      toast.success('Consulta agendada')
      setForm({animalId:'',tipo:'',data:'',observacoes:''})
      setList(await Consultas.listMine(user.id))
    }catch(e:any){
      console.error('Erro ao agendar consulta:', e)
      toast.error(e?.response?.data?.erro || e?.response?.data?.message || e?.message || 'Falha ao agendar consulta')
    }
  }
  const remove = async(id:number)=>{ if(!user) return; await Consultas.remove(id); toast.success('Consulta excluída'); setList(await Consultas.listMine(user.id)) }
  const add1h = async(id:number, oldISO:string)=>{ if(!user) return; const next = new Date(new Date(oldISO).getTime()+3600000).toISOString(); await Consultas.update(id, { data: next }); toast.success('Consulta reagendada'); setList(await Consultas.listMine(user.id)) }
  const badge = (s:string)=> s==='CONCLUIDA' ? 'badge-primary' : s==='CANCELADA' ? 'bg-red-600 text-white' : 'badge-accent'
  return (<div className="grid gap-4 md:grid-cols-2">
    <Card className="rounded-2xl">
      <CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Agendar Consulta</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <Select value={form.animalId} onValueChange={(value)=>setForm(prev=>({...prev, animalId:value}))} disabled={!myAnimals.length}>
          <SelectTrigger>
            <SelectValue placeholder={myAnimals.length ? 'Selecione um dos meus animais' : 'Cadastre um animal primeiro'} />
          </SelectTrigger>
          <SelectContent>
            {myAnimals.map((animal)=>(
              <SelectItem key={animal.id} value={String(animal.id)}>
                {animal.nome} • {animal.especie} ({animal.raca})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!myAnimals.length && <p className="text-xs text-gray-500">Cadastre um animal na aba "Meus Animais" para agendar uma consulta.</p>}
        <Input placeholder="Tipo (ex.: Banho, Tosa)" value={form.tipo} onChange={e=>setForm(prev=>({...prev, tipo:e.target.value}))}/>
        <Input type="date" value={form.data} onChange={e=>setForm(prev=>({...prev, data:e.target.value}))}/>
        <Input placeholder="Observações" value={form.observacoes||''} onChange={e=>setForm(prev=>({...prev, observacoes:e.target.value}))}/>
        <Button className="w-full" onClick={create} disabled={!myAnimals.length}>Agendar</Button>
      </CardContent>
    </Card>
    <Card className="rounded-2xl">
      <CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Minhas Consultas</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table><TableHeader><TableRow><TableHead>#</TableHead><TableHead>Animal</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead className="w-48">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{list.map((c:any)=>(<TableRow key={c.id}>
          <TableCell>{c.id}</TableCell><TableCell>{animalNomePorId.get(c.animalId) || `#${c.animalId}`}</TableCell><TableCell>{c.tipo}</TableCell><TableCell>{br.format(new Date(c.data))}</TableCell>
          <TableCell><span className={`px-2 py-1 rounded-full text-xs ${badge(c.status)}`}>{c.status}</span></TableCell>
          <TableCell className="flex gap-2"><Button variant="secondary" onClick={()=>add1h(c.id, c.data)}>+1h</Button><Button variant="destructive" onClick={()=>remove(c.id)}>Excluir</Button></TableCell>
        </TableRow>))}</TableBody></Table>
      </CardContent>
    </Card>
  </div>)
}

function ClienteHistoricoPage(){
  const { user } = useAuth()
  const [list,setList]=useState<Consulta[]>([])
  const [myAnimals,setMyAnimals]=useState<Animal[]>([])
  React.useEffect(()=>{
    if(!user) return
    const load = async()=>{
      try{
        const [animals, consultas] = await Promise.all([
          Animais.listMine(user.id),
          Consultas.listMine(user.id)
        ])
        setMyAnimals(animals)
        setList(consultas)
      }catch(e){
        console.error('Erro ao carregar histórico de consultas', e)
        toast.error('Falha ao carregar histórico')
      }
    }
    load()
  },[user])
  const br = new Intl.DateTimeFormat('pt-BR', { dateStyle:'short' })
  const now = Date.now()
  const isFutureAgendada = (consulta: Consulta) => {
    if (consulta.status !== 'AGENDADA') return false
    const parsed = new Date(consulta.data)
    if (Number.isNaN(parsed.getTime())) return false
    return parsed.getTime() >= now
  }
  const futuras = list.filter(isFutureAgendada)
  const historico = list.filter(c => !isFutureAgendada(c))
  const badge = (s:string)=> s==='CONCLUIDA' ? 'badge-primary' : s==='CANCELADA' ? 'bg-red-600 text-white' : 'badge-accent'
  const animalNomePorId = React.useMemo(() => {
    const map = new Map<number, string>()
    myAnimals.forEach((animal)=>{
      map.set(animal.id, animal.nome)
    })
    return map
  }, [myAnimals])
  const renderRows = (items: Consulta[], prefix: 'future'|'past') => items.map((c)=>{
    const parsed = new Date(c.data)
    const dataFormatada = Number.isNaN(parsed.getTime()) ? '—' : br.format(parsed)
    const animal = animalNomePorId.get(c.animalId) || `#${c.animalId}`
    return (
      <TableRow key={`${prefix}-${c.id}`}>
        <TableCell>{c.id}</TableCell>
        <TableCell>{animal}</TableCell>
        <TableCell>{c.tipo}</TableCell>
        <TableCell>{dataFormatada}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs ${badge(c.status)}`}>{c.status}</span>
        </TableCell>
        <TableCell>{c.observacoes?.trim() || '—'}</TableCell>
      </TableRow>
    )
  })
  const hasAny = futuras.length + historico.length > 0
  return (
    <Card className="rounded-2xl">
      <CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Histórico de Consultas</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Obs.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {futuras.length > 0 && (
              <>
                <TableRow>
                  <TableCell colSpan={6} className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    Próximas consultas
                  </TableCell>
                </TableRow>
                {renderRows(futuras, 'future')}
              </>
            )}
            {historico.length > 0 && (
              <>
                <TableRow>
                  <TableCell colSpan={6} className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    Consultas anteriores
                  </TableCell>
                </TableRow>
                {renderRows(historico, 'past')}
              </>
            )}
            {!hasAny && (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-sm text-gray-500">
                  Nenhuma consulta registrada até o momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


function MeusAnimaisPage(){
  const { user } = useAuth()
  const [list,setList]=useState<any[]>([])
  const [form,setForm]=useState<{nome:string; especie:string; raca:string; idade:string}>({nome:'', especie:'', raca:'', idade:''})
  const [editing,setEditing]=useState<{id:number; nome:string; especie:string; raca:string; idade:string} | null>(null)

  const load = async()=>{
    if(!user) return;
    const data = user.tipo === 'admin' ? await Animais.list() : await Animais.listMine(user.id)
    setList(data)
  }
  React.useEffect(()=>{ load().catch(()=>toast.error('Falha ao carregar meus animais')) },[user])

  const create = async()=>{
    if(!user) return
    if(!form.nome || !form.especie || !form.raca) return toast.error('Informe nome, espécie e raça')
    let idadeNumero: number | undefined
    if (form.idade !== '') {
      const parsed = Number(form.idade)
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast.error('Idade inválida')
        return
      }
      idadeNumero = Math.floor(parsed)
    }
    await Animais.create({
      nome: form.nome,
      especie: form.especie,
      raca: form.raca,
      clienteId: user.id,
      ...(form.idade !== '' ? { idade: idadeNumero } : {}),
    })
    setForm({nome:'', especie:'', raca:'', idade:''}); toast.success('Animal cadastrado!'); await load()
  }

  const save = async()=>{
    if(!editing) return
    if(!editing.nome || !editing.especie || !editing.raca) {
      toast.error('Informe nome, espécie e raça')
      return
    }
    let idadeNumero: number | null = null
    if (editing.idade !== '') {
      const parsed = Number(editing.idade)
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast.error('Idade inválida')
        return
      }
      idadeNumero = Math.floor(parsed)
    }
    await Animais.update(editing.id, {
      nome: editing.nome,
      especie: editing.especie,
      raca: editing.raca,
      idade: editing.idade === '' ? null : idadeNumero,
    })
    setEditing(null); toast.success('Animal atualizado!'); await load()
  }

  const remove = async(id:number)=>{ await Animais.remove(id); toast.success('Animal removido'); await load() }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-2xl">
        <CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Cadastrar meu animal</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})}/>
          <Input placeholder="Espécie (ex.: cachorro, gato)" value={form.especie} onChange={e=>setForm({...form, especie:e.target.value})}/>
          <Input placeholder="Raça" value={form.raca} onChange={e=>setForm({...form, raca:e.target.value})}/>
          <Input type="number" min={0} placeholder="Idade (opcional)" value={form.idade} onChange={e=>setForm({...form, idade:e.target.value})}/>
          <Button className="w-full" onClick={create}>Salvar</Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="card-header-grad rounded-t-2xl"><CardTitle className="text-white">Meus animais</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Nome</TableHead><TableHead>Espécie</TableHead><TableHead>Raça</TableHead><TableHead>Idade</TableHead><TableHead className="w-40">Ações</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {list.map((a:any)=>{
                const isEditingRow = editing?.id === a.id
                return (
                  <TableRow key={a.id}>
                    <TableCell>{isEditingRow && editing ? <Input value={editing.nome} onChange={e=>setEditing(prev=>prev&&prev.id===a.id?{...prev, nome:e.target.value}:prev)}/> : <span className="font-medium">{a.nome}</span>}</TableCell>
                    <TableCell>{isEditingRow && editing ? <Input value={editing.especie} onChange={e=>setEditing(prev=>prev&&prev.id===a.id?{...prev, especie:e.target.value}:prev)}/> : <span className="capitalize">{a.especie}</span>}</TableCell>
                    <TableCell>{isEditingRow && editing ? <Input value={editing.raca} onChange={e=>setEditing(prev=>prev&&prev.id===a.id?{...prev, raca:e.target.value}:prev)}/> : <span className="capitalize">{a.raca}</span>}</TableCell>
                    <TableCell>{isEditingRow && editing ? <Input type="number" min={0} value={editing.idade} onChange={e=>setEditing(prev=>prev&&prev.id===a.id?{...prev, idade:e.target.value}:prev)}/> : <span>{a.idade ?? '—'}</span>}</TableCell>
                    <TableCell className="flex gap-2">
                      {isEditingRow ? (<>
                        <Button size="sm" onClick={save}>Salvar</Button>
                        <Button size="sm" variant="ghost" onClick={()=>setEditing(null)}>Cancelar</Button>
                      </>) : (<>
                        <Button size="sm" variant="secondary" onClick={()=>setEditing({ id:a.id, nome:a.nome, especie:a.especie, raca:a.raca, idade:a.idade!=null?String(a.idade):'' })}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={()=>remove(a.id)}>Excluir</Button>
                      </>)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function Home(){
  const { user } = useAuth()
  const isAdmin = user?.tipo === 'admin'
  return (<div className="min-h-screen w-full bg-pet-app">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AppShell/>
      <Tabs defaultValue={isAdmin ? 'dashboard' : 'animais'} className="space-y-6">
        {isAdmin ? (<>
          <TabsList className="grid grid-cols-7 lg:w-[1100px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            <TabsTrigger value="animais">Animais</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="consultas-admin">Consultas (agendadas)</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><DashboardPage/></TabsContent>
          <TabsContent value="pedidos"><PedidosPage/></TabsContent>
          <TabsContent value="fornecedores"><FornecedoresPage/></TabsContent>
          <TabsContent value="animais"><MeusAnimaisPage/></TabsContent>
          <TabsContent value="clientes"><ClientesPage/></TabsContent>
          <TabsContent value="consultas-admin"><AdminConsultasPage/></TabsContent>
        </>) : (<>
          <TabsList className="grid grid-cols-4 lg:w-[780px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="animais">Meus Animais</TabsTrigger>
            <TabsTrigger value="consultas">Consultas</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><DashboardPage/></TabsContent>
          <TabsContent value="animais"><MeusAnimaisPage/></TabsContent>
          <TabsContent value="consultas"><ClienteConsultasPage/></TabsContent>
          <TabsContent value="historico"><ClienteHistoricoPage/></TabsContent>
        </>)}
      </Tabs>
    </div>
  </div>)
}


export default function App(){ return (<AuthProvider><AuthGate><Home/></AuthGate></AuthProvider>) }
