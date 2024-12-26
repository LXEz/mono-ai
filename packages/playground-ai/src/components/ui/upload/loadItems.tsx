import CheckIcon from '@/assets/CheckCircle.svg';
import PdfIcon from '@/assets/icon-pdf.svg';

import { FileItem } from '@/lib/models/files';
import { cn } from '@/lib/utils';
import { Loader, X } from 'lucide-react';
import { motion } from 'motion/react';
export function LoadItems({ files, onCancel }: { files: FileItem[]; onCancel?: (file: FileItem) => void }) {
  return (
    <div className="space-y-3   overflow-auto">
      {files.map((file) => (
        <div className=" p-3 rounded-lg flex border-[1px] " key={file.name}>
          <PdfIcon fill="none" />

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {file.name}
                {file.progress === 100 ? <CheckIcon /> : <Loader className="w-4 h-4 animate-pulse-slow" />}
              </div>

              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => onCancel?.(file)}
                disabled={!onCancel}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 my-[2px]">
              <span className="">Size:{Math.round(file.size / 1024)} KB</span>
              <span> {file.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={cn('bg-blue-600 h-2 rounded-full w-0')}
                animate={{ width: file.progress ? `${file.progress}%` : '0%' }}
                // transition={{ duration: 1 }}
              ></motion.div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
