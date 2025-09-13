
import React, { useState, createContext, useContext } from 'react'
const Ctx = createContext<any>(null)
export function Tabs({ defaultValue, children, className='' }: any){
  const [value, setValue] = useState(defaultValue)
  return <Ctx.Provider value={{value, setValue}}><div className={className}>{children}</div></Ctx.Provider>
}
export function TabsList({ children, className='' }: any){ return <div className={`flex gap-2 rounded-xl bg-gray-100 p-1 ${className}`}>{children}</div> }
export function TabsTrigger({ value, children, className='' }: any){
  const {value:cur, setValue} = useContext(Ctx)
  const active = cur===value
  return <button onClick={()=>setValue(value)} className={`px-3 py-1.5 text-sm rounded-lg ${active?'bg-white shadow':'text-gray-600 hover:text-black'} ${className}`}>{children}</button>
}
export function TabsContent({ value, children, className='' }: any){
  const {value:cur} = useContext(Ctx)
  if (cur!==value) return null
  return <div className={className}>{children}</div>
}
