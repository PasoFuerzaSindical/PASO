import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
export async function POST(req){ const { line, email } = await req.json();
  try{
    // find or create user by email (demo)
    let user = await prisma.user.findUnique({ where: { email } });
    if(!user){ user = await prisma.user.create({ data: { email, password: 'nopass' } }); }
    const entry = await prisma.bingoEntry.create({ data: { userId: user.id, line } });
    return NextResponse.json({ ok:true, entry });
  }catch(e){ return NextResponse.json({ ok:false, error: String(e) }) }
}
