import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

/* ✅ FIX: Extend JWTPayload */
export interface SessionData extends JWTPayload {
  userId: string;
  email: string;
  name?: string;
  photoURL?: string;
  firebaseUid: string;
}

export async function createSession(data: SessionData) {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const cookieStore = cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('session');

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token.value, secret);
    return payload as SessionData;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}
