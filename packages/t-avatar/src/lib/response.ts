import { NextResponse } from 'next/server';

export const InternalServerErrorResponse = (message = 'Internal server error') =>
  NextResponse.json({ message }, { status: 500 });

export const OriginalErrorResponse = (res: Response) =>
  NextResponse.json(
    { message: res.statusText },
    {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    },
  );
