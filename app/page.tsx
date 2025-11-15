import Link from 'next/link'
export default function Home(){
  return (
    <main>
      <h1 style={{fontSize:28}}>P.A.S.O. — Campaña</h1>
      <p>Bienvenido al prototipo. Usa: <Link href='/oracle'>Oráculo</Link> · <Link href='/social'>RRSS</Link> · <Link href='/bingo'>Bingo</Link></p>
    </main>
  )
}
