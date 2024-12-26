import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

/**
 * http://localhost:3000/api/protected
 */
export async function GET(req: NextRequest) {
  const session = await auth(req);

  console.info('auth getServerSession');

  if (session) {
    return Response.json({ data: 'Protected data' });
  }

  return Response.json({ message: 'Not authenticated for Protected data' }, { status: 401 });
}
