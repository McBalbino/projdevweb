
import React from 'react'
export function Select({ value, onValueChange, children }: any){ return <div className="relative">{React.Children.map(children, (c:any)=>React.cloneElement(c, {value, onValueChange}))}</div>}
export function SelectTrigger({ children, ...props }: any){ return <button className="w-full rounded-xl border px-3 py-2 text-sm bg-white" {...props}>{children}</button> }
export function SelectValue({ placeholder }: {placeholder?:string}){ return <span>{placeholder || ''}</span> }
export function SelectContent({ children }: any){ return <div className="absolute z-40 mt-2 w-full rounded-xl border bg-white shadow">{children}</div> }
export function SelectItem({ value, children, onValueChange }: any){ return <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100" onClick={()=>onValueChange?.(value)}>{children}</button> }
