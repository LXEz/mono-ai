'use client';

import { UploadComponent } from '@/components/ui/upload/index';
import { useClearTemplate } from '@/hooks/useClearTemplate';

export function DocSummary() {
  useClearTemplate();
  return (
    <>
      <div className="text-2xl font-bold mb-8">Doc Summary</div>
      <UploadComponent
        description="Upload any PDF file, and Playground AI will analyze it, providing you with a summary."
        maxSize={64 * 1024}
        fileNumber={1}
      />
    </>
  );
}
