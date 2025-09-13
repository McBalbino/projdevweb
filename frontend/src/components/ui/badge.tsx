
import React from 'react'
export function Badge({ children, variant='secondary', className='' }: {children:React.ReactNode; variant?:'default'|'secondary'|'destructive'; className?:string}){
  const styles = variant==='default' ? 'badge-primary' : variant==='destructive' ? 'bg-red-600 text-white' : 'badge-accent'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${styles} ${className}`}>{children}</span>
}
