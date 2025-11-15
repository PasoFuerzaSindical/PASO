import './globals.css'
import type { ReactNode } from 'react'
export const metadata = { title: 'P.A.S.O.' }
export default function RootLayout({ children }:{ children: ReactNode }){
  return (<html lang='es'><body><div className='container'>{children}</div></body></html>)
}
