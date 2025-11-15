'use client'
import { useState } from 'react'
const sample = ['Guardias sin relevo','Reunión que podía ser email','Turno sin material','Cambio de turno no pagado','Paciente sin medicación']
export default function Bingo(){
  const [checked,setChecked]=useState(Array(sample.length).fill(false))
  function toggle(i){ const c=[...checked]; c[i]=!c[i]; setChecked(c); }
  const complete = checked.filter(Boolean).length>=3
  async function save(){ await fetch('/api/bingo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({line:checked.map((v,i)=>v?sample[i]:null).filter(Boolean).join(', '), email: 'anonymous@paso.local'})}) }
  return (<div><h2>Bingo precario</h2><ul>{sample.map((s,i)=>(<li key={i}><label><input type='checkbox' checked={checked[i]} onChange={()=>toggle(i)}/> {s}</label></li>))}</ul>{complete && <div><strong>¡Línea completada!</strong><br/><button onClick={save}>Guardar diploma</button></div>}</div>)
}
