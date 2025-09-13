
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
type Ctx = { open: boolean; setOpen: (v:boolean)=>void }
const DialogCtx = createContext<Ctx | null>(null)
export function Dialog({ children, open:openProp, onOpenChange }:{ children:React.ReactNode; open?:boolean; onOpenChange?:(v:boolean)=>void }) {
  const [open, setOpen] = useState(!!openProp)
  useEffect(()=>{ if (openProp!==undefined) setOpen(openProp) }, [openProp])
  const set = (v:boolean) => { setOpen(v); onOpenChange?.(v) }
  return <DialogCtx.Provider value={{ open, setOpen:set }}>{children}</DialogCtx.Provider>
}
export function DialogTrigger({ asChild, children }:{ asChild?:boolean; children:any }) {
  const ctx = useContext(DialogCtx)!
  const child = React.Children.only(children)
  const onClick = (e:any)=>{ child.props?.onClick?.(e); ctx.setOpen(true) }
  return asChild ? React.cloneElement(child, { onClick }) : <button onClick={onClick}>{children}</button>
}
export function DialogContent({ children, className='' }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(DialogCtx)!
  if (!ctx?.open) return null
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{ if (e.key==='Escape') ctx.setOpen(false) }
    const onClick = (e:MouseEvent)=>{ if (!containerRef.current) return; if (e.target instanceof Node && !containerRef.current.contains(e.target)) ctx.setOpen(false) }
    document.addEventListener('keydown', onKey); document.addEventListener('mousedown', onClick)
    return ()=>{ document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [ctx])
  return (<div className="fixed inset-0 z-[60] flex items-center justify-center"><div className="absolute inset-0 bg-black/40"/><div ref={containerRef} className={`relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl ${className}`} role="dialog" aria-modal="true">{children}</div></div>)
}
export function DialogHeader({ children }: {children: React.ReactNode}) { return <div className="p-4 border-b">{children}</div> }
export function DialogTitle({ children }: {children: React.ReactNode}) { return <h3 className="text-lg font-semibold">{children}</h3> }
export function DialogDescription({ children }: {children: React.ReactNode}) { return <p className="text-sm text-gray-500">{children}</p> }
export function DialogFooter({ children }: {children: React.ReactNode}) { return <div className="p-4 border-t flex justify-end gap-2">{children}</div> }
