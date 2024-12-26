import { create } from 'zustand';

// Define file status type
export type FileStatus = 'uploading' | 'success' | 'error' | 'pending';

// Define file item interface
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress?: number;
  url?: string;
  error?: string;
  createdAt: string;
  originFile: File;
  content?: string;
  contentLength?: number;
}

export type FileItemWithoutProgress = Partial<Omit<FileItem, 'progress'>>;

// Define file store interface
interface FileStore {
  files: FileItem[];
  addFile: (file: FileItem) => void;
  removeFile: (id: string) => void;
  updateFileStatus: (id: string, status: FileStatus, props?: Partial<FileItem>) => void;
  clearFiles: () => void;
  updateFileProgress: (id: string, progress: number, extra?: FileItemWithoutProgress) => void;
  onLoaded: (file: FileItem) => void;
  getFileById: (id: string) => FileItem | undefined;
}

// Create file store
export const useFileStore = create<FileStore>((set, get) => ({
  files: [],

  addFile: (file) =>
    set((state) => {
      // Check if the file already exists based on id
      const exists = state.files.some((existingFile) => existingFile.id === file.id);
      if (!exists) {
        return { files: [...state.files, file] };
      }
      return state; // Return unchanged state if file exists
    }),

  removeFile: (id) => set((state) => ({ files: state.files.filter((file) => file.id !== id) })),

  updateFileStatus: (id, status, props = {}) =>
    set((state) => ({
      files: state.files.map((file) => (file.id === id ? { ...file, status, ...props } : file)),
    })),

  clearFiles: () => set({ files: [] }),
  updateFileProgress: (id, progress, extra = {}) =>
    set((state) => ({
      files: state.files.map((file) => (file.id === id ? { ...file, progress, ...extra } : file)),
    })),
  onLoaded: (file) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === file.id ? { ...f, ...file } : f)),
    })),
  getFileById: (id) => {
    // Retrieve the file by id
    return get().files.find((file) => file.id === id);
  },
}));
