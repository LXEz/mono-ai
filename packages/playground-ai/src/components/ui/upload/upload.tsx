import UploadIcon from '@/assets/icon-upload.svg';
import { ChangeEvent, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
export function UploadBox({ onChange, maxSize = 32 * 1024 }: { onChange?: (files: File[]) => void; maxSize?: number }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(Array.from(e.target.files || []));
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: (acceptedFiles, fileRejections) => {
      onChange?.(fileRejections.map((f) => f.file).concat(acceptedFiles));
    },
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  const renderPlaceholder = useCallback(() => {
    if (isDragActive) {
      return <p>Drop it</p>;
    }
    return (
      <>
        <p>Click or drag files to upload</p>
        <p className="text-sm text-gray-500">Maximum file token size {maxSize / 1024}KB</p>
      </>
    );
  }, [isDragActive, maxSize]);
  return (
    <div
      className="flex flex-col items-center justify-center w-full p-6
    border-2 border-dashed rounded-lg hover:cursor-pointer bg-[#f5f5ff]"
      {...getRootProps()}
      onClick={handleClick}
    >
      <UploadIcon className="w-10 h-10 text-[#390cd9] mb-2" />
      <div className="text-center">{renderPlaceholder()}</div>
      <input
        ref={fileInputRef}
        id="file-upload-handle"
        type="file"
        onChange={(e) => handleFileChange(e)}
        className="hidden"
        // accept="application/pdf"
      />
    </div>
  );
}
