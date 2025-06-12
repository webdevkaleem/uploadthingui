"use client";

import ActionButton from "@/components/uploadthingui/common/action-button";
import ButtonDetails from "@/components/uploadthingui/common/button-details";
import { UploadButton, useUploadThing } from "@/lib/uploadthing";
import {
  checkFileObjectKey,
  getFileSizeFormatted,
  truncateFileName,
} from "@/lib/uploadthingui-utils";
import { useFileStorageStore, UTUIFile } from "@/stores/main";
import { createId } from "@paralleldrive/cuid2";
import { useEffect, useRef, type ComponentProps } from "react";
import { toast } from "sonner";
import { generatePermittedFileTypes } from "uploadthing/client";

// Get the props type directly from UploadButton
type UploadButtonProps = ComponentProps<typeof UploadButton>;

/**
 * @description An upload button component which uses toasts as its response method.
 * @param {UploadButtonProps} props - The props for the UploadButton component.
 * @param {boolean} showDetails - Whether to show the details of the upload.
 * @param {string} instanceId - The instance ID for the upload. Required to avoid multiple instances of the same component if multiple upload buttons are used.
 * @param {boolean} allowInBetweenUploads - Whether to allow in between uploads.
 * @param {routeDetails} routeDetails - Additional details for the upload; Example: maxFileCount, minFileCount, etc.
 * @param {React.ReactNode} children - React node to render a custom button component.
 */
export default function ToastButton({
  props,
  showDetails = false,
  instanceId,
  allowInBetweenUploads = true,
  routeDetails,
  children,
}: {
  props: UploadButtonProps;
  showDetails?: boolean;
  instanceId: string;
  routeDetails?: {
    maxFileCount?: number;
    minFileCount?: number;
  };
  allowInBetweenUploads?: boolean;
  children?: React.ReactNode;
}) {
  // [1]. States, Refs, Hooks, etc.
  const { endpoint, ...restProps } = props;

  // Used to reference the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getFiles, addFiles } = useFileStorageStore();

  // Used to get the route config from uploadthing
  const { routeConfig } = useUploadThing(endpoint, {
    ...restProps,
  });

  const files = getFiles(instanceId);

  const canUpload =
    allowInBetweenUploads ||
    files.filter((file) => file.status === "uploading").length === 0;

  // Used to generate the accepted file types
  const acceptedFileTypes = generatePermittedFileTypes(routeConfig)
    .fileTypes.map((fileType) => {
      if (fileType.includes("/")) {
        return fileType;
      } else {
        return `${fileType}/*`;
      }
    })
    .join(",");

  // Used to check the file route options
  const fileRouteOptions = checkFileObjectKey({
    str: generatePermittedFileTypes(routeConfig).fileTypes[0],
    obj: routeConfig,
  });

  // If the file route options are not found then return
  if (!fileRouteOptions) return;

  // [2]. Handlers
  // Used to open the file input prompt
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Used to handle the file change event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    // If no files are selected then return
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (!canUpload) return;

    // At this moment, the files are not uploaded, so we set the status to "not started"
    addFiles(
      instanceId,
      Array.from(selectedFiles).map((fileObj) => ({
        id: createId(),
        file: fileObj,
        status: "not started",
        createdAt: new Date(),
      })),
      routeDetails ?? {}
    );

    // Reset the input to allow selection of the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // [3]. JSX
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex">
        {/* Hidden input to allow selection of files */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={
            routeDetails?.maxFileCount === undefined ||
            routeDetails.maxFileCount > 1
          }
          accept={acceptedFileTypes}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-4">
          <ActionButton
            children={children}
            handleFileButtonClick={handleFileButtonClick}
            disabled={!canUpload}
          />
          {showDetails && (
            <ButtonDetails
              acceptedFileTypes={acceptedFileTypes}
              maxFileCount={routeDetails?.maxFileCount ?? 0}
              minFileCount={routeDetails?.minFileCount ?? 0}
              maxFileSize={fileRouteOptions.maxFileSize}
            />
          )}
        </div>
      </div>
      {/* Uploading toasts */}
      {files.map((file) => (
        <UploadingToast
          key={file.id}
          file={file}
          props={props}
          instanceId={instanceId}
        />
      ))}
    </main>
  );
}

/**
 * @description A component that displays the uploading toast.
 * @param {UTUIFile} file - The file to upload.
 * @param {UploadButtonProps} props - The props for the UploadButton component.
 * @param {string} instanceId - The instance ID for the upload. Required to avoid multiple instances of the same component if multiple upload buttons are used.
 */
function UploadingToast({
  file,
  props,
  instanceId,
}: {
  file: UTUIFile;
  props: UploadButtonProps;
  instanceId: string;
}) {
  // [1]. States, Refs, Hooks, etc.
  const { endpoint, ...restProps } = props;

  const fileUploadRef = useRef(false);

  // Used to create an abort controller
  const abortControllerRef = useRef<AbortController | null>(
    new AbortController()
  );

  const { removeFiles, updateFile, getFiles } = useFileStorageStore();

  // Used to start the upload
  const { startUpload } = useUploadThing(endpoint, {
    ...restProps,
    // Set the upload progress granularity to "fine" if not provided
    uploadProgressGranularity: restProps.uploadProgressGranularity ?? "fine",
    signal: abortControllerRef.current?.signal,
    onUploadError: (error) => {
      // Run the onUploadError prop if provided
      restProps.onUploadError?.(error);

      // Update the file status to "error" and set the error message
      updateFile(instanceId, {
        ...file,
        status: "error",
        error: error.message,
      });

      // Throw the error to be caught by the toast
      throw new Error(error.message);
    },
    onBeforeUploadBegin: (files) => {
      // Run the onUploadBegin prop if provided
      restProps?.onUploadBegin?.(file.file.name);

      // Update the file status to "uploading"
      updateFile(instanceId, { ...file, status: "uploading" });

      return files;
    },
    onClientUploadComplete: (res) => {
      // Run the onClientUploadComplete prop if provided
      restProps?.onClientUploadComplete?.(res);

      // Update the file status to "uploaded"
      updateFile(instanceId, { ...file, status: "uploaded" });
    },
  });

  // [2]. Effects
  // This effect will only then start the upload to avoid rerendering / reuploading the same files
  useEffect(() => {
    if (!fileUploadRef.current && file.status === "not started") {
      // Set the file upload ref to true to avoid reuploading the same file
      fileUploadRef.current = true;

      // Start the upload
      const fileUploadPromise = startUpload([file.file]);

      // Render the toast
      toast.promise(fileUploadPromise, {
        loading: (
          <div className="flex flex-col">
            <p>Uploading...</p>
            <p>
              {truncateFileName(file.file.name)} (
              {getFileSizeFormatted(file.file.size)})
            </p>
          </div>
        ),
        success: () => {
          // Remove the file from the state to avoid reuploading the same file
          removeFiles(instanceId, file.id);

          return {
            message: `Uploaded successfully!`,
            description: `${truncateFileName(
              file.file.name
            )} - (${getFileSizeFormatted(file.file.size)})`,
          };
        },
        error: () => {
          const currentFile = getFiles(instanceId).find(
            (f) => f.id === file.id
          );

          // Remove the file from the state to avoid reuploading the same file
          removeFiles(instanceId, file.id);

          return {
            message: `${
              currentFile?.error
                ? truncateFileName(currentFile.error, 32)
                : "Failed to upload!"
            }`,
            description: `${truncateFileName(
              file.file.name
            )} - (${getFileSizeFormatted(file.file.size)})`,
          };
        },
        action: {
          label: `Close`,
          onClick: () => {
            // Remove the file and abort the upload
            abortControllerRef.current?.abort();
            removeFiles(instanceId, file.id);
          },
        },
      });
    }
  }, [file]);

  // Returning null because the toast is rendered by the useUploadThing hook
  return null;
}
