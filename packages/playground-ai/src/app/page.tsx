import Center from '@/components/center';
import Left from '@/components/left';
import RemProvider from '@/components/RemProvider';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <RemProvider>
      <div className="flex  w-full h-full gap-2 p-4">
        <Left className="" />
        <Center className="flex-1 bg-transparent " />
        <Toaster />
      </div>
    </RemProvider>
  );
}
