'use client'
import { useState } from 'react'
export default function Social(){
  const [text,setText]=useState('')
  const [out,setOut]=useState<any>(null)
  async function gen(){ const r = await fetch('/api/social/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({source_text:text})}); setOut(await r.json()) }
  return (<div><h2>Generador RRSS</h2><textarea value={text} onChange={e=>setText(e.target.value)} rows={4} style={{width:'100%'}}></textarea><br/><button onClick={gen}>Generar</button>{out && <pre>{JSON.stringify(out,null,2)}</pre>}</div>)
}
