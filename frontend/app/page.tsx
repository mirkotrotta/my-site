import { redirect } from 'next/navigation';

export default function Home() {
  // This is a temporary solution
  // We'll replace this with proper middleware in a subsequent task
  redirect('/de');
}
