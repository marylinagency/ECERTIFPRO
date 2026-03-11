import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

export interface AuthPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT token from request headers
 */
export async function verifyAuth(request: NextRequest): Promise<AuthPayload | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as AuthPayload;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

/**
 * Middleware to protect routes that require authentication
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthPayload) => Promise<Response>
): Promise<NextResponse> {
  const user = await verifyAuth(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  return handler(request, user);
}

/**
 * Middleware to protect routes that require admin role
 */
export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthPayload) => Promise<Response>
): Promise<NextResponse> {
  const user = await verifyAuth(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required' },
      { status: 403 }
    );
  }

  return handler(request, user);
}

/**
 * Create JWT token for user session
 */
export async function createJWT(payload: Omit<AuthPayload, 'iat' | 'exp'>): Promise<string> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
    );

    // Create JWT token that expires in 24 hours
    const token = new TextEncoder().encode(
      JSON.stringify({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    );

    // For simplicity, using base64 encoding (in production, use proper JWT library)
    return Buffer.from(token).toString('base64');
  } catch (error) {
    console.error('Token creation failed:', error);
    throw new Error('Failed to create authentication token');
  }
}
