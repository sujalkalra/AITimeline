import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const DEVELOPER_CODE = process.env.DEVELOPER_CODE || 'matrix';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    if (code !== DEVELOPER_CODE) {
      return NextResponse.json({ error: 'Invalid developer code' }, { status: 401 });
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const sessionToken = await encrypt({ role: 'admin', expires });
    
    // Save the session in a cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
