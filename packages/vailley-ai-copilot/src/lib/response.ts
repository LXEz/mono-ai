export const BadRequestResponse = (message: string = 'Bad request') =>
  new Response(JSON.stringify({ message }), { status: 400 });

export const UnauthorizedResponse = (message: string = 'Unauthorized') =>
  new Response(JSON.stringify({ message }), { status: 401 });

export const ForbiddenResponse = (message: string = 'Forbidden') =>
  new Response(JSON.stringify({ message }), { status: 403 });

export const NotFoundResponse = (message: string = 'Not found') =>
  new Response(JSON.stringify({ message }), { status: 404 });

export const InternalServerErrorResponse = (message: string = 'Internal server error') =>
  new Response(JSON.stringify({ message }), { status: 500 });
