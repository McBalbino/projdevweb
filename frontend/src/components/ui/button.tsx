
import React from 'react'
import cx from 'classnames'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default'|'secondary'|'destructive'|'ghost'
  size?: 'default'|'icon'
}
export function Button({ className, variant='default', size='default', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition'
  const variants = {
    default: 'btn-primary',                 // emerald
    secondary: 'btn-accent',                // sky
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-sky-50'
  } as const
  const sizes = {
    default: '',
    icon: 'w-9 h-9 p-0'
  } as const
  return <button className={cx(base, variants[variant], sizes[size], className)} {...props} />
}
