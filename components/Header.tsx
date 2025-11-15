import Link from 'next/link'
export default function Header(){ return (<header className='py-4'><nav className='flex gap-4'><Link href='/'>Inicio</Link><Link href='/oracle'>Oráculo</Link><Link href='/social'>RRSS</Link><Link href='/bingo'>Bingo</Link></nav></header>) }
