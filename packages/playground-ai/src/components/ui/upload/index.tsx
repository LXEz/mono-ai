'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadItems } from '@/components/ui/upload/loadItems';
import { UploadBox } from '@/components/ui/upload/upload';
import { useToast } from '@/hooks/use-toast';
import { FileItem, useFileStore } from '@/lib/models/files';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

const checkFileNumber = (files: File[], fileNumber: number | null) => {
  return fileNumber ? files.length <= fileNumber : true;
};

export function UploadComponent({
  description,
  maxSize,
  fileNumber = null,
  onUpload,
  onPressUploadButton,
  triggerChildren,
}: {
  description: string;
  maxSize: number;
  fileNumber?: number | null;
  onUpload?: (files: FileItem[]) => void;
  onPressUploadButton?: () => void;
  triggerChildren?: React.ReactNode;
}) {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const storeFiles = useFileStore((state) => state.files);
  const addFile = useFileStore((state) => state.addFile);
  const removeFile = useFileStore((state) => state.removeFile);
  const clearFiles = useFileStore((state) => state.clearFiles);
  const allowedUpload = useMemo(() => {
    return storeFiles.length === fileNumber;
  }, [storeFiles, fileNumber]);
  const handleChange = (newFiles: File[]) => {
    if (!checkFileNumber(newFiles.concat(storeFiles.map((fileItem) => fileItem.originFile)), fileNumber)) {
      toast({
        title: 'File number error',
        description: `only allowed upload ${fileNumber} file${(fileNumber ?? 0 > 1) ? 's' : ''}`,
        variant: 'destructive',
      });
      return;
    }

    newFiles.forEach((file) => {
      const newFile: FileItem = {
        id: file.name + '-' + String(file.size),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'pending',
        createdAt: file.lastModified.toString(),
        originFile: file,
      };
      addFile(newFile);
      onUpload?.([newFile]);
    });
  };
  const handleCancel = () => {
    clearFiles();
    setIsOpen(false);
  };
  const handleRemove = (file: FileItem) => {
    removeFile(file.id);
  };
  const handleUpload = () => {
    if (!allowedUpload) {
      toast({
        title: 'Can not upload',
        description: `Please upload the ${fileNumber} number of files and each file less than ${maxSize / 1024}kB`,
        variant: 'destructive',
      });
      return;
    }
    setIsOpen(false);
    // onUpload?.(storeFiles);
    onPressUploadButton?.();
  };
  const renderDialog = () => {
    const defaultTrigger = (
      <Button
        className="bg-[#0E66E9] text-white hover:bg-[#0E66E9]/80 rounded-r-none border-r
           border-white/30 focus:outline-none w-[300px] ml-4"
      >
        Upload Files
      </Button>
    );

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerChildren ?? defaultTrigger}</DialogTrigger>

        <DialogContent className="sm:max-w-[800px] max-h-[90%] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <DialogDescription>{description}</DialogDescription>
          <div className="grid gap-4 py-4  overflow-auto">
            <UploadBox onChange={handleChange} maxSize={maxSize} />
            <LoadItems files={storeFiles} onCancel={handleRemove} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              // disabled={files.length === 0}
              className={cn(
                'text-white bg-[#3676e8]',
                !allowedUpload && 'bg-gray-500 cursor-not-allowed hover:bg-gray-500 hover:text-white',
              )}
              onClick={handleUpload}
            >
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  return renderDialog();
}
