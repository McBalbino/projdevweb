
import React, { useState, createContext, useContext } from "react"

type TabsContextType = { value: string; setValue: (v: string) => void }
const TabsContext = createContext<TabsContextType | null>(null)

export function Tabs({ defaultValue, children, className = "" }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`tabs-wrap ${className}`}>{children}</div>
}

export function TabsTrigger({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("TabsTrigger precisa estar dentro de <Tabs>")
  const active = ctx.value === value
  return (
    <button onClick={() => ctx.setValue(value)} className={`tabs-trigger ${active ? "tabs-trigger-active" : "tabs-trigger-inactive"} ${className}`}>
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("TabsContent precisa estar dentro de <Tabs>")
  if (ctx.value !== value) return null
  return <div className={className}>{children}</div>
}
