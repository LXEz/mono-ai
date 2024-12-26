import { NextResponse } from 'next/server';

export const BadRequestResponse = (message = 'Bad request') =>
  new Response(JSON.stringify({ message }), { status: 400 });

export const UnauthorizedResponse = (message = 'Unauthorized') =>
  new Response(JSON.stringify({ message }), { status: 401 });

export const ForbiddenResponse = (message = 'Forbidden') => new Response(JSON.stringify({ message }), { status: 403 });

export const NotFoundResponse = (message = 'Not found') => new Response(JSON.stringify({ message }), { status: 404 });

export const InternalServerErrorResponse = (message = 'Internal server error') =>
  new Response(JSON.stringify({ message }), { status: 500 });

export const OriginalErrorResponse = (res: Response) =>
  NextResponse.json(
    { message: res.statusText },
    {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    },
  );
