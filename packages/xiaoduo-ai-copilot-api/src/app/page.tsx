import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/api');

  return null;
}
