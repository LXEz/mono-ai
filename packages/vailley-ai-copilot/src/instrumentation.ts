export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.NODE_ENV === 'production') {
      await import('./instrumentation.prod.ts');
    }
  }
};
