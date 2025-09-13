
import React from 'react'
export function DropdownMenu({ children }: {children:React.ReactNode}){ return <div className="relative inline-block">{children}</div> }
export function DropdownMenuTrigger({ asChild, children, ...props }: any) { return React.cloneElement(children, props) }
export function DropdownMenuContent({ children, align='start' }: {children:React.ReactNode; align?:'start'|'end'}) { return <div className={`absolute mt-2 ${align==='end'?'right-0':''} z-40 min-w-[160px] rounded-xl border bg-white shadow`}>{children}</div> }
export function DropdownMenuLabel({ children }: {children:React.ReactNode}){ return <div className="px-3 py-2 text-xs text-gray-500">{children}</div> }
export function DropdownMenuItem({ children, className='', ...props }: any){ return <button className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${className}`} {...props}>{children}</button> }
export function DropdownMenuSeparator(){ return <div className="h-px bg-gray-200"/> }
export function DropdownMenuCheckboxItem(props:any){ return <DropdownMenuItem {...props} /> }
