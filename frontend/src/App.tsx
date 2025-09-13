
import React, { useEffect, useMemo, useState } from 'react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit3, Trash2, PawPrint, Users, Building2, Calendar, Search, ChevronDown, CheckCircle2, XCircle, LogOut } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Clients } from '@/api/clients'
import { Animais } from '@/api/animais'
import { Fornecedores, ProdutoFornecedor } from '@/api/fornecedores'
import { Pedidos, StatusPedido } from '@/api/pedidos'

function AppShell(){ const { user, logout } = useAuth(); return (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Petshop</h1>
      <p className="text-gray-500">Conectado ao backend • {user?.tipo?.toUpperCase()}</p>
    </div>
    <Button variant="secondary" onClick={logout} className="gap-2"><LogOut className="h-4 w-4"/>Sair</Button>
  </div>
)}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (<div className="relative w-full max-w-sm">
    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "Buscar..."} className="pl-8" />
  </div>)
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (<div className="p-4 rounded-2xl border bg-white"><div className="text-sm text-gray-500">{label}</div><div className="text-2xl font-semibold">{value}</div></div>)
}

// === AUTH ===
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (<div className="min-h-screen w-full flex items-center justify-center bg-pet-auth p-4"><div className="w-full max-w-md">{children}</div></div>)
}
function LoginForm({ onSwitch }: { onSwitch: () => void }){
  const { login } = useAuth()
  const [email,setEmail]=useState(''); const [senha,setSenha]=useState('')
  const submit = async()=>{ try{ await login(email, senha); toast.success('Bem-vindo(a)!') }catch(e:any){ toast.error(e?.response?.data?.message||'Falha no login') } }
  return (<Card className="rounded-2xl shadow-xl backdrop-blur bg-white/95">
    <CardHeader><CardTitle className="text-2xl">Entrar</CardTitle><CardDescription>Acesse o sistema do Petshop</CardDescription></CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-2"><Label>E-mail</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div className="grid gap-2"><Label>Senha</Label><Input type="password" value={senha} onChange={e=>setSenha(e.target.value)}/></div>
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={submit}>Entrar</Button>
      <p className="text-sm text-gray-500 text-center">Não tem conta? <button className="underline" onClick={onSwitch}>Cadastre-se</button></p>
    </CardContent>
  </Card>)
}
function SignupForm({ onSwitch }: { onSwitch: () => void }){
  const { signup } = useAuth()
  const [nome,setNome]=useState(''); const [email,setEmail]=useState(''); const [senha,setSenha]=useState(''); const [tel,setTel]=useState('')
  const submit = async()=>{ try{ await signup(nome,email,senha,tel); toast.success('Conta criada. Faça login.'); onSwitch() }catch(e:any){ toast.error(e?.response?.data?.message||'Falha no cadastro') } }
  return (<Card className="rounded-2xl shadow-xl backdrop-blur bg-white/95">
    <CardHeader><CardTitle className="text-2xl">Criar conta</CardTitle><CardDescription>Cadastre-se para começar</CardDescription></CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-2"><Label>Nome</Label><Input value={nome} onChange={e=>setNome(e.target.value)}/></div>
      <div className="grid gap-2"><Label>E-mail</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div className="grid gap-2"><Label>Telefone</Label><Input value={tel} onChange={e=>setTel(e.target.value)}/></div>
      <div className="grid gap-2"><Label>Senha</Label><Input type="password" value={senha} onChange={e=>setSenha(e.target.value)}/></div>
      <Button className="w-full bg-sky-600 hover:bg-sky-700" onClick={submit}>Cadastrar</Button>
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

// === Páginas ===
function DashboardPage(){
  // Placeholder simples
  const kpis = [{servico:'banho', total:4},{servico:'tosa', total:2}]
  return (<div className="grid gap-4 md:grid-cols-2">
    <Card className="rounded-2xl"><CardHeader><CardTitle>Serviços agendados</CardTitle><CardDescription>Distribuição por tipo</CardDescription></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={kpis}><XAxis dataKey="servico"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="total"/></BarChart></ResponsiveContainer></div></CardContent></Card>
    <Card className="rounded-2xl"><CardHeader><CardTitle>Resumo</CardTitle><CardDescription>Integração com backend ativa</CardDescription></CardHeader><CardContent><div className="grid grid-cols-3 gap-3"><Metric label="KPIs" value={2}/><Metric label="Relatórios" value="—"/><Metric label="Status" value="OK"/></div></CardContent></Card>
  </div>)
}

function ClientesPage(){
  const [list,setList]=useState<any[]>([]); const [q,setQ]=useState('')
  const refresh = async()=> setList(await Clients.list())
  useEffect(()=>{ refresh().catch(()=>toast.error('Falha ao carregar clientes')) },[])
  const filtered = list.filter((c)=>`${c.nome} ${c.email} ${c.telefone}`.toLowerCase().includes(q.toLowerCase()))
  return (<>
    <div className="flex items-center justify-between gap-2 py-2">
      <SearchBox value={q} onChange={setQ} placeholder="Buscar por nome, e-mail, telefone" />
    </div>
    <Card className="rounded-2xl"><CardContent className="p-0">
      <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>E-mail</TableHead><TableHead>Telefone</TableHead></TableRow></TableHeader>
      <TableBody>{filtered.map((c)=>(<TableRow key={c.id}><TableCell className="font-medium">{c.nome}</TableCell><TableCell>{c.email}</TableCell><TableCell>{c.telefone}</TableCell></TableRow>))}</TableBody></Table>
    </CardContent></Card>
  </>)
}

function AnimaisPage(){
  const [list,setList]=useState<any[]>([]); const [q,setQ]=useState('')
  useEffect(()=>{ Animais.list().then(setList).catch(()=>toast.error('Falha ao carregar animais')) },[])
  return (<Card className="rounded-2xl"><CardContent className="p-0">
    <div className="p-3"><SearchBox value={q} onChange={setQ} placeholder="Buscar por nome, espécie ou tutor" /></div>
    <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Espécie</TableHead><TableHead>Tutor</TableHead></TableRow></TableHeader>
    <TableBody>{list.filter(a=>`${a.nome} ${a.especie}`.toLowerCase().includes(q.toLowerCase())).map((a)=>(<TableRow key={a.id}><TableCell className="font-medium">{a.nome}</TableCell><TableCell className="capitalize">{a.especie}</TableCell><TableCell>{a.clienteId}</TableCell></TableRow>))}</TableBody></Table>
  </CardContent></Card>)
}

function FornecedoresPage(){
  const [list,setList]=useState<any[]>([]); const [q,setQ]=useState('')
  useEffect(()=>{ Fornecedores.list().then(setList).catch(()=>toast.error('Falha ao carregar fornecedores')) },[])
  const filtered = list.filter((f:any)=>`${f.nome} ${f.cnpj}`.toLowerCase().includes(q.toLowerCase()))
  return (<>
    <div className="flex items-center justify-between gap-2 py-2">
      <SearchBox value={q} onChange={setQ} placeholder="Buscar por nome ou CNPJ" />
    </div>
    <Card className="rounded-2xl"><CardContent className="p-0">
      <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>CNPJ</TableHead></TableRow></TableHeader>
      <TableBody>{filtered.map((f:any)=>(<TableRow key={f.id}><TableCell className="font-medium">{f.nome}</TableCell><TableCell>{f.cnpj}</TableCell></TableRow>))}</TableBody></Table>
    </CardContent></Card>
  </>)
}

function PedidosPage(){
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const [pedidos,setPedidos]=useState<any[]>([])
  const [fornecedores,setFornecedores]=useState<any[]>([])
  const [fornecedorId,setFornecedorId]=useState<number|undefined>()
  const [catalogo,setCatalogo]=useState<ProdutoFornecedor[]>([])
  const [itens,setItens]=useState<{produtoFornecedorId:number; quantidade:number; precoUnitario?:number}[]>([])

  const refresh = async()=>{
    const [p, f] = await Promise.all([Pedidos.list(), Fornecedores.list()])
    setPedidos(p); setFornecedores(f)
  }
  useEffect(()=>{ refresh().catch(()=>toast.error('Falha ao carregar pedidos')) },[])

  const loadCatalogo = async(id:number)=>{
    setFornecedorId(id)
    const prods = await Fornecedores.listProdutos(id)
    setCatalogo(prods)
    setItens([])
  }

  const addItem = (produtoFornecedorId:number)=>{
    setItens(prev=>[...prev, { produtoFornecedorId, quantidade:1 }])
  }
  const createPedido = async()=>{
    if (!fornecedorId || itens.length===0) return toast.error('Selecione fornecedor e itens')
    await Pedidos.create(fornecedorId, itens)
    toast.success('Pedido criado'); setItens([]); setCatalogo([]); setFornecedorId(undefined); refresh()
  }
  const setStatus = async(id:number, status:StatusPedido)=>{ await Pedidos.setStatus(id, status); toast.success('Status atualizado'); refresh() }
  const receber = async(id:number)=>{ await Pedidos.receber(id); toast.success('Pedido recebido'); refresh() }

  return (<div className="grid gap-4 md:grid-cols-2">
    <Card className="rounded-2xl"><CardHeader><CardTitle>Novo Pedido de Compra</CardTitle><CardDescription>Fornecedor e itens do catálogo</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          <Label>Fornecedor</Label>
          <Select value={fornecedorId as any} onValueChange={(v:any)=>loadCatalogo(Number(v))}>
            <SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger>
            <SelectContent>
              {fornecedores.map((f:any)=>(<SelectItem key={f.id} value={String(f.id)}>{f.nome}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        {catalogo.length>0 && (<div className="border rounded-xl p-2 max-h-48 overflow-auto">
          <div className="text-sm mb-2 text-gray-500">Catálogo</div>
          {catalogo.map((p)=>(
            <div key={p.id} className="flex items-center justify-between py-1">
              <div className="text-sm">{p.nome} • {p.sku} • {brl.format(Number(p.preco ?? 0))}</div>
              <Button variant="secondary" onClick={()=>addItem(p.id)}>Adicionar</Button>
            </div>
          ))}
        </div>)}
        {itens.length>0 && (<div className="border rounded-xl p-2">
          <div className="text-sm mb-2 text-gray-500">Itens do pedido</div>
          {itens.map((it,idx)=>(
            <div key={idx} className="flex items-center gap-2 py-1">
              <span className="text-sm flex-1">ProdutoFornecedor #{it.produtoFornecedorId}</span>
              <Input type="number" min={1} value={it.quantidade} onChange={e=>{
                const q = Number(e.target.value)||1; setItens(prev=>prev.map((p,i)=>i===idx?{...p, quantidade:q}:p))
              }} className="w-24"/>
            </div>
          ))}
        </div>)}
        <Button onClick={createPedido} className="w-full">Criar Pedido</Button>
      </CardContent>
    </Card>

    <Card className="rounded-2xl"><CardHeader><CardTitle>Pedidos</CardTitle><CardDescription>Gerencie o ciclo do pedido</CardDescription></CardHeader>
      <CardContent className="p-0">
        <Table><TableHeader><TableRow><TableHead>#</TableHead><TableHead>Fornecedor</TableHead><TableHead>Status</TableHead><TableHead className="w-48">Ações</TableHead></TableRow></TableHeader>
        <TableBody>
          {pedidos.map((p:any)=>(<TableRow key={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.fornecedorId}</TableCell>
            <TableCell>{p.status}</TableCell>
            <TableCell className="flex gap-2">
              <Button variant="secondary" onClick={()=>setStatus(p.id,'APROVADO')}>Aprovar</Button>
              <Button variant="secondary" onClick={()=>setStatus(p.id,'ENVIADO')}>Enviar</Button>
              <Button variant="secondary" onClick={()=>receber(p.id)}>Receber</Button>
            </TableCell>
          </TableRow>))}
        </TableBody></Table>
      </CardContent>
    </Card>
  </div>)
}

function Home(){
  const { user } = useAuth()
  const isAdmin = user?.tipo === 'admin'
  return (<div className="min-h-screen w-full bg-pet-app">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AppShell/>
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-5 lg:w-[720px]">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pedidos" className="gap-2"><Calendar className="h-4 w-4"/>Pedidos</TabsTrigger>
          <TabsTrigger value="fornecedores" className="gap-2"><Building2 className="h-4 w-4"/>Fornecedores</TabsTrigger>
          <TabsTrigger value="animais" className="gap-2"><PawPrint className="h-4 w-4"/>Animais</TabsTrigger>
          {isAdmin && <TabsTrigger value="clientes" className="gap-2"><Users className="h-4 w-4"/>Clientes</TabsTrigger>}
        </TabsList>

        <TabsContent value="dashboard"><DashboardPage/></TabsContent>
        <TabsContent value="pedidos"><PedidosPage/></TabsContent>
        <TabsContent value="fornecedores"><FornecedoresPage/></TabsContent>
        <TabsContent value="animais"><AnimaisPage/></TabsContent>
        {isAdmin && <TabsContent value="clientes"><ClientesPage/></TabsContent>}
      </Tabs>
    </div>
  </div>)
}

export default function App(){
  return (<AuthProvider><AuthGate><Home/></AuthGate></AuthProvider>)
}
