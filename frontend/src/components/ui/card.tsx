
import React from 'react'
export function Card({ className='', ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`card ${className}`} {...props} /> }
export function CardHeader({ className='', ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`p-4 ${className}`} {...props} /> }
export function CardTitle({ className='', ...props }: React.HTMLAttributes<HTMLDivElement>) { return <h3 className={`card-title-strong ${className}`} {...props} /> }
export function CardDescription({ className='', ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={`text-sm text-gray-500 ${className}`} {...props} /> }
export function CardContent({ className='', ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`p-4 ${className}`} {...props} /> }
