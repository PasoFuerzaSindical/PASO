import { NextResponse } from 'next/server'
export async function POST(req){ const body = await req.json(); return NextResponse.json({ text: 'Post generado (mock)', prompt: 'Surreal prompt for: '+(body.source_text||'') }) }
