import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'
export async function POST(req){ const { email, password, name } = await req.json(); const pw = await bcrypt.hash(password, 10); try{ const u = await prisma.user.create({ data: { email, password: pw, name } }); return NextResponse.json({ ok:true, user: { id: u.id, email: u.email } }); }catch(e){ return NextResponse.json({ ok:false, error: String(e) }) } }
