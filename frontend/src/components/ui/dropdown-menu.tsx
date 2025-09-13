
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
type MenuCtx = { open:boolean; setOpen:(v:boolean)=>void }
const Ctx = createContext<MenuCtx | null>(null)
export function DropdownMenu({ children }:{ children:React.ReactNode }){ const [open, setOpen] = useState(false); return <Ctx.Provider value={{ open, setOpen }}><div className="relative inline-block">{children}</div></Ctx.Provider> }
export function DropdownMenuTrigger({ asChild, children }:{ asChild?:boolean; children:any }){ const ctx = useContext(Ctx)!; const child = React.Children.only(children); const onClick = (e:any)=>{ child.props?.onClick?.(e); ctx.setOpen(!ctx.open) }; return asChild ? React.cloneElement(child, { onClick }) : <button onClick={onClick}>{children}</button> }
export function DropdownMenuContent({ children, align='start' }:{ children:React.ReactNode; align?:'start'|'end' }){
  const ctx = useContext(Ctx)!
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if (!ctx.open) return
    const onKey = (e:KeyboardEvent)=>{ if (e.key==='Escape') ctx.setOpen(false) }
    const onClick = (e:MouseEvent)=>{ if (!ref.current) return; if (e.target instanceof Node && !ref.current.contains(e.target)) ctx.setOpen(false) }
    document.addEventListener('keydown', onKey); document.addEventListener('mousedown', onClick)
    return ()=>{ document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [ctx.open])
  if (!ctx.open) return null
  return <div ref={ref} className={`absolute mt-2 ${align==='end'?'right-0':''} z-[70] min-w-[180px] rounded-xl border bg-white shadow-lg`}>{children}</div>
}
export function DropdownMenuLabel({ children }:{ children:React.ReactNode }){ return <div className="px-3 py-2 text-xs text-gray-500">{children}</div> }
export function DropdownMenuItem({ children, className='', onClick, ...props }:{ children:React.ReactNode; className?:string; onClick?:(e:any)=>void }){
  const ctx = useContext(Ctx)!; const handle = (e:any)=>{ onClick?.(e); ctx.setOpen(false) }
  return <button className={`w-full text-left px-3 py-2 text-sm hover:bg-sky-50 ${className}`} onClick={handle} {...props}>{children}</button>
}
export function DropdownMenuSeparator(){ return <div className="h-px bg-gray-200"/> }
export function DropdownMenuCheckboxItem(props:any){ return <DropdownMenuItem {...props} /> }
