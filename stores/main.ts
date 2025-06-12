import { toast } from "sonner";
import { create } from "zustand";

export type UTUIFile = {
  file: File;
  id: string;
  status: "uploading" | "uploaded" | "not started" | "error";
  error?: string;
  createdAt: Date;
};

type additionalDetails = {
  maxFileCount?: number;
  minFileCount?: number;
};

interface FileStorageState {
  instances: Record<string, UTUIFile[]>;
  addFiles: (
    instanceId: string,
    files: UTUIFile[],
    additionalDetails: additionalDetails
  ) => void;
  removeFiles: (instanceId: string, fileId: string) => void;
  updateFile: (instanceId: string, file: UTUIFile) => void;
  getFiles: (instanceId: string) => UTUIFile[];
}

const defaultFileStorageState = {
  instances: {},
};

export const useFileStorageStore = create<FileStorageState>()((set, get) => ({
  ...defaultFileStorageState,
  // Takes an array of files and add them to the state for a specific instance
  addFiles: (
    instanceId: string,
    files: UTUIFile[],
    additionalDetails: additionalDetails
  ) => {
    if (
      additionalDetails.maxFileCount &&
      get().getFiles(instanceId).length + files.length >
        additionalDetails.maxFileCount
    ) {
      toast.error(`Failed to upload!`, {
        description: `Max file count of ${additionalDetails.maxFileCount} exceeded.`,
        action: {
          label: `Close`,
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    if (
      additionalDetails.minFileCount &&
      get().getFiles(instanceId).length + files.length <
        additionalDetails.minFileCount
    ) {
      toast.error(`Failed to upload!`, {
        description: `Required to upload at least ${additionalDetails.minFileCount} files.`,
        action: {
          label: `Close`,
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }
    return set((state) => ({
      instances: {
        ...state.instances,
        [instanceId]: [...(state.instances[instanceId] || []), ...files],
      },
    }));
  },
  // Takes an array of files and remove them from the state for a specific instance
  removeFiles: (instanceId: string, fileId: string) => {
    return set((state) => ({
      instances: {
        ...state.instances,
        [instanceId]: (state.instances[instanceId] || []).filter(
          (file) => file.id !== fileId
        ),
      },
    }));
  },
  updateFile: (instanceId: string, file: UTUIFile) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [instanceId]: (state.instances[instanceId] || []).map((f) =>
          f.id === file.id ? file : f
        ),
      },
    })),
  getFiles: (instanceId: string) => get().instances[instanceId] || [],
}));
