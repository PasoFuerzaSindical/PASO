'use client'
import { useState } from 'react'
export default function Oracle(){
  const [q,setQ]=useState('')
  const [out,setOut]=useState<any>(null)
  async function ask(){
    const r = await fetch('/api/gemini',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:q})})
    const j = await r.json(); setOut(j)
  }
  return (<div><h2>Oráculo</h2><textarea value={q} onChange={e=>setQ(e.target.value)} rows={4} style={{width:'100%'}}></textarea><br/><button onClick={ask}>Preguntar</button>{out && <pre>{JSON.stringify(out,null,2)}</pre>}</div>)
}
