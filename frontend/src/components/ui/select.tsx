
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
type SelectCtx = { open:boolean; setOpen:(v:boolean)=>void; value?: string; setValue:(v:string)=>void; setLabel:(v:string)=>void; label?: string }
const Ctx = createContext<SelectCtx | null>(null)
export function Select({ value, onValueChange, children }:{ value?:any; onValueChange?:(v:any)=>void; children:any }){
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState<string | undefined>(value)
  const [label, setLabel] = useState<string | undefined>(undefined)
  useEffect(()=>{ setVal(value) }, [value])
  const setValue = (v:string)=>{ setVal(v); onValueChange?.(v); setOpen(false) }
  return <Ctx.Provider value={{ open, setOpen, value:val, setValue, setLabel, label }}>{children}</Ctx.Provider>
}
export function SelectTrigger({ children, ...props }: any){
  const ctx = useContext(Ctx)!
  return <button type="button" className="w-full rounded-xl border px-3 py-2 text-sm bg-white flex items-center justify-between" onClick={()=>ctx.setOpen(!ctx.open)} {...props}>{children}</button>
}
export function SelectValue({ placeholder }:{ placeholder?:string }){ const ctx = useContext(Ctx)!; return <span>{ctx.label ?? placeholder ?? ''}</span> }
export function SelectContent({ children }:{ children:any }){
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
  return <div ref={ref} className="absolute z-[70] mt-2 w-full rounded-xl border bg-white shadow-lg">{children}</div>
}
export function SelectItem({ value, children }:{ value:string; children:any }){
  const ctx = useContext(Ctx)!
  const onClick = ()=>{ ctx.setLabel(typeof children==='string'?children: (children?.props?.children ?? String(value))); ctx.setValue(value) }
  const active = ctx.value === value
  return <button type="button" className={`w-full text-left px-3 py-2 text-sm hover:bg-sky-50 ${active?'bg-sky-50':''}`} onClick={onClick}>{children}</button>
}
