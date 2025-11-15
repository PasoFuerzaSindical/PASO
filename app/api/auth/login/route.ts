import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'
import jwt from 'jsonwebtoken'
export async function POST(req){ const { email, pass } = await req.json(); const u = await prisma.user.findUnique({ where: { email } }); if(!u) return NextResponse.json({ ok:false }); const ok = await bcrypt.compare(pass, u.password); if(!ok) return NextResponse.json({ ok:false }); const token = jwt.sign({ sub: u.id, email: u.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' }); return NextResponse.json({ ok:true, token }); }
