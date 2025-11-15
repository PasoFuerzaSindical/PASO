import { NextResponse } from 'next/server'
export async function POST(req){ const body = await req.json(); // placeholder - call Gemini here using process.env.GEMINI_API_KEY
 return NextResponse.json({ ok:true, prompt: body.prompt || body.q || null, mock: true }) }
