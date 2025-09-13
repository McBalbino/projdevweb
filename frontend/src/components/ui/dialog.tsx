
import React from 'react'
type RootProps = { children: React.ReactNode }
export function Dialog({ children }: RootProps) { return <>{children}</> }
export function DialogTrigger({ asChild, children, ...props }: any) { return React.cloneElement(children, props) }
export function DialogContent({ children, className='' }: React.HTMLAttributes<HTMLDivElement>) {
  return (<div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/40"/><div className={`relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl ${className}`}>{children}</div></div>)
}
export function DialogHeader({ children }: {children: React.ReactNode}) { return <div className="p-4 border-b">{children}</div> }
export function DialogTitle({ children }: {children: React.ReactNode}) { return <h3 className="text-lg font-semibold">{children}</h3> }
export function DialogDescription({ children }: {children: React.ReactNode}) { return <p className="text-sm text-gray-500">{children}</p> }
export function DialogFooter({ children }: {children: React.ReactNode}) { return <div className="p-4 border-t flex justify-end gap-2">{children}</div> }
