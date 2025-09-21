
import React from 'react'
import cx from 'classnames'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default'|'secondary'|'destructive'|'ghost'|'outline'
  size?: 'default'|'icon'|'sm'
}
export function Button({ className, variant='default', size='default', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2'
  const variants = { default: 'btn-primary', secondary: 'btn-accent', destructive: 'bg-red-600 text-white hover:bg-red-700', ghost: 'bg-transparent hover:bg-sky-50', outline: 'border border-emerald-500 text-emerald-700 hover:bg-emerald-50' } as const
  const sizes = { default: '', icon: 'w-9 h-9 p-0', sm: 'px-3 py-1.5 text-xs' } as const
  return <button className={cx(base, variants[variant], sizes[size], className)} {...props} />
}
