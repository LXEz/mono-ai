import { FileItem, FileItemWithoutProgress, useFileStore } from '@/lib/models/files';
import * as pdfjsLib from 'pdfjs-dist';
import { sleep } from '../utils';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Progress callback interface
export interface ProgressInfo {
  id: string;
  progress: number; // Progress percentage (0-100)
  remainTime: number; // Estimated remaining time in seconds
}

// Result interface
interface PdfResult {
  content: string; // Extracted text content
  totalTokens: number; // Total number of characters
}

// Main PDF processing function
export async function processPdf(
  file: FileItem,
  // pdfPath: string | URL | TypedArray | ArrayBuffer,
  onProgress?: (info: ProgressInfo, extra?: FileItemWithoutProgress) => void,
): Promise<PdfResult> {
  let allText = '';

  // Load PDF document
  const loadingTask = pdfjsLib.getDocument(await readFileAsTypedArray(file.originFile));
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  // Time tracking for progress estimation
  const initTime = Date.now();
  let curTime = initTime;

  // Process each page
  for (let i = 1; i <= numPages; i++) {
    await sleep(50);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent({
      includeMarkedContent: false,
    });

    // Extract text from page
    const strings = textContent.items.map((item) => {
      return 'str' in item ? item.str : '';
    });

    allText += strings.join(' ') + '\n';

    // Calculate progress
    curTime = Date.now();
    if (onProgress) {
      onProgress(
        {
          id: file.id,
          progress: Math.floor((i / numPages) * 100),
          remainTime: Math.round((((curTime - initTime) / i) * (numPages - i)) / 1000),
        },
        {
          content: allText,
          contentLength: allText.length,
        },
      );
    }
  }

  // Clean up text (remove null characters)
  allText = allText.replace(/\u0000/g, '');

  return {
    content: allText,
    totalTokens: allText.length,
  };
}

// Read file content as ArrayBuffer
export async function readFileAsTypedArray(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const typedArray = new Uint8Array(arrayBuffer);
      resolve(typedArray);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function handleUpload(
  files: FileItem[],
  onProgress?: (info: ProgressInfo, extra?: FileItemWithoutProgress) => void,
  onLoaded?: (file: FileItem) => void,
) {
  files.forEach(async (file) => {
    try {
      const result = await processPdf(file, onProgress);
      console.log(result);
      const currentFile = useFileStore.getState().getFileById(file.id)!;
      onLoaded?.({ ...currentFile, content: result.content, contentLength: result.totalTokens, status: 'success' });
    } catch (error) {
      console.error('Error reading files:', error);
      onLoaded?.({ ...file, status: 'error' });
    }
  });
}
