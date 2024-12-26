'use client';

import { UploadComponent } from '@/components/ui/upload/index';
import { useClearTemplate } from '@/hooks/useClearTemplate';
import { handleUpload, ProgressInfo } from '@/lib/pdfParse/index';

export function FileCompare() {
  useClearTemplate();
  const handleProcess = (info: ProgressInfo) => {
    console.log(info);
  };

  return (
    <>
      <div className="text-2xl font-bold mb-8">File Compare</div>
      <UploadComponent
        description="Upload two PDF files. Playground AI will analyze them and answer your questions."
        maxSize={32 * 1024 * 1024}
        fileNumber={2}
        onUpload={(files) => {
          handleUpload(files, handleProcess);
        }}
      />
    </>
  );
}
