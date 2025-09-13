
import React from 'react'
export function Table({ children }: any){ return <table className="w-full text-sm">{children}</table> }
export function TableHeader({ children }: any){ return <thead className="bg-gray-50">{children}</thead> }
export function TableBody({ children }: any){ return <tbody className="divide-y">{children}</tbody> }
export function TableRow({ children }: any){ return <tr className="hover:bg-gray-50">{children}</tr> }
export function TableHead({ children, className='' }: any){ return <th className={`text-left px-4 py-2 font-medium text-gray-600 ${className}`}>{children}</th> }
export function TableCell({ children, className='' }: any){ return <td className={`px-4 py-2 ${className}`}>{children}</td> }
