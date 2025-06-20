"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UploadButton, useUploadThing } from "@/lib/uploadthing";
import {
  checkFileObjectKey,
  getFileSizeFormatted,
  truncateFileName,
} from "@/lib/uploadthingui-utils";
import { cn } from "@/lib/utils";
import { useFileStorageStore, type UTUIFile } from "@/stores/main";
import { createId } from "@paralleldrive/cuid2";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "@uploadthing/shared";
import { File, Upload, UploadCloud, X } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { toast } from "sonner";

// Get the props type directly from UploadButton
type UploadButtonProps = ComponentProps<typeof UploadButton>;

/**
 * @description An upload button component which opens up a dialog with a dropzone and uses toasts as its response method.
 * @param {UploadButtonProps} props - The props for the UploadButton component.
 * @param {boolean} showDetails - Whether to show the details of the upload.
 * @param {string} instanceId - The instance ID for the upload. Required to avoid multiple instances of the same component if multiple upload buttons are used.
 * @param {boolean} allowInBetweenUploads - Whether to allow in between uploads.
 * @param {routeDetails} routeDetails - Additional details for the upload; Example: maxFileCount, minFileCount, etc.
 * @param {React.ReactNode} children - React node to render a custom button component.
 */
export default function DropzoneDialog({
  props,
  showDetails = true,
  instanceId,
  allowInBetweenUploads = true,
  routeDetails,
  children,
}: {
  props: UploadButtonProps;
  showDetails?: boolean;
  instanceId: string;
  allowInBetweenUploads?: boolean;
  routeDetails?: {
    maxFileCount?: number;
    minFileCount?: number;
  };
  children?: React.ReactNode;
}) {
  // [1]. States, Refs, Hooks, etc.
  const { endpoint, ...restProps } = props;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState(false);

  // Used to start the combined upload
  const [startUpload, setStartUpload] = useState(false);

  const { getFiles, addFiles, removeFiles } = useFileStorageStore();

  const files = getFiles(instanceId);
  const filesNotStarted = files.filter((file) => file.status === "not started");
  const { routeConfig } = useUploadThing(endpoint, {
    ...restProps,
  });

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

  // [2]. Handlers
  // Used to handle the dropzone drop event
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Set the start upload state to false to avoid reuploading the same files
      setStartUpload(false);

      // At this moment, the files are not uploaded, so we set the status to "not started"
      addFiles(
        instanceId,
        acceptedFiles.map((file) => ({
          id: createId(),
          file,
          status: "not started",
          createdAt: new Date(),
        })),
        routeDetails ?? {}
      );
    },
    [addFiles, instanceId, routeDetails]
  );

  // Used to get the dropzone props
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    multiple:
      routeDetails?.maxFileCount === undefined || routeDetails.maxFileCount > 1,
    // Enforce the same limit at the dropzone level
    maxFiles: routeDetails?.maxFileCount ?? undefined,
  });

  function uploadButtonClicked() {
    if (!canUpload) return;

    setStartUpload(true);

    // Close the dialog
    setOpen(false);
  }

  // If the file route options are not found then return
  if (!fileRouteOptions) return;

  // [3]. JSX
  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <DropzoneDialogAndDrawerActionButton
              onClick={() => setOpen(true)}
              children={children}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription asChild>
                <div className="overflow-hidden py-4 flex-col rounded-md flex items-center justify-center relative">
                  {/* Dropzone */}
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    {...getRootProps()}
                  ></div>
                  {/* Hidden input to allow selection of files */}
                  <input {...getInputProps()} />
                  {filesNotStarted.length > 0 ? (
                    <div className="w-full border rounded-md overflow-hidden border-dashed px-4 py-8">
                      <div className="w-full px-4 md:px-16">
                        {filesNotStarted.map((file) => (
                          <DropzoneFileDetails
                            key={file.id}
                            file={file}
                            instanceId={instanceId}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border w-full py-4 rounded-md border-dashed flex items-center justify-center flex-col gap-4">
                      <UploadCloud className="w-12 h-12" />
                      <p className="text-sm text-primary">
                        Choose files or drag and drop
                      </p>
                      {showDetails && (
                        <ButtonDetails
                          acceptedFileTypes={acceptedFileTypes}
                          maxFileCount={routeDetails?.maxFileCount ?? 0}
                          minFileCount={routeDetails?.minFileCount ?? 0}
                          maxFileSize={fileRouteOptions.maxFileSize}
                        />
                      )}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DropzoneDialogAndDrawerActionButton
                onClick={uploadButtonClicked}
                children={children}
                className="w-full"
                disabled={!canUpload}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Uploading toasts */}
        {startUpload &&
          files.map((file) => (
            <UploadingToast
              key={file.id}
              file={file}
              props={props}
              instanceId={instanceId}
            />
          ))}
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <DropzoneDialogAndDrawerActionButton
            onClick={() => setOpen(true)}
            children={children}
          />
        </DrawerTrigger>
        <DrawerContent>
          {/* For sm reason only max-h accepts only 75vh. Nothing else works  */}
          {/* Don't change this to overflow-y-auto or overflow-y-scroll */}
          <DrawerHeader className="overflow-y-scroll max-h-[75vh]">
            <DrawerTitle asChild>
              <div className="relative">
                <p className="">Upload Files</p>

                {/* Copied from shadcn/ui/dialog.tsx */}
                <div className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <div className="rounded-sm text-xs border py-1 px-2 hover:bg-muted">
                    Esc
                  </div>
                  <span className="sr-only">Close</span>
                </div>
              </div>
            </DrawerTitle>
            <DrawerDescription asChild>
              <div className="relative max-h-[50%] overflow-hidden py-4">
                {/* Dropzone */}
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  {...getRootProps()}
                ></div>
                {/* Hidden input to allow selection of files */}
                <input {...getInputProps()} />
                {filesNotStarted.length > 0 ? (
                  <div className="w-full border rounded-md overflow-hidden border-dashed px-4 py-8">
                    <div className="w-full px-4 md:px-16">
                      {filesNotStarted.map((file) => (
                        <DropzoneFileDetails
                          key={file.id}
                          file={file}
                          instanceId={instanceId}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border w-full py-4 rounded-md border-dashed flex items-center justify-center flex-col gap-4">
                    <UploadCloud className="w-12 h-12" />
                    <p className="text-sm text-primary">
                      Choose files or drag and drop
                    </p>
                    {showDetails && (
                      <ButtonDetails
                        acceptedFileTypes={acceptedFileTypes}
                        maxFileCount={routeDetails?.maxFileCount ?? 0}
                        minFileCount={routeDetails?.minFileCount ?? 0}
                        maxFileSize={fileRouteOptions.maxFileSize}
                      />
                    )}
                  </div>
                )}
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DropzoneDialogAndDrawerActionButton
              onClick={uploadButtonClicked}
              children={children}
              className="w-full"
              disabled={!canUpload}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Uploading toasts */}
      {startUpload &&
        files.map((file) => (
          <UploadingToast
            key={file.id}
            file={file}
            props={props}
            instanceId={instanceId}
          />
        ))}
    </>
  );
}

/**
 * @description A component that renders a button for the dropzone dialog and drawer.
 * @param {React.ReactNode} children - The children to render.
 * @param {() => void} onClick - The onClick handler.
 */
function DropzoneDialogAndDrawerActionButton({
  onClick,
  className,
  children,
  disabled,
}: {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  // /* If a custom button has returned then render that and attach the onClick handler to it
  if (children && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, {
      onClick,
      disabled,
      ...(children as React.ReactElement<any>).props,
    }) as React.ReactElement;
  }

  return (
    <Button
      className={cn("w-fit", className)}
      onClick={onClick}
      disabled={disabled}
    >
      <Upload className="w-4 h-4" />
      <span className="ml-2">Upload</span>
    </Button>
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
            message: `${currentFile?.error
              ? truncateFileName(currentFile.error, 32)
              : "Failed to upload"
              }`,
            description: `${truncateFileName(
              file.file.name
            )} - (${getFileSizeFormatted(file.file.size)})`,
          };
        },
        action: {
          // If the file is still uploading then show the cancel button, otherwise show the close button
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

/**
 * @description A component that displays the details of the upload files.
 * @param {UTUIFile} file - The file to upload.
 * @param {string} instanceId - The instance ID for the upload. Required to avoid multiple instances of the same component if multiple upload buttons are used.
 */
function DropzoneFileDetails({
  file,
  instanceId,
}: {
  file: UTUIFile;
  instanceId: string;
}) {
  // [1]. States, Refs, Hooks, etc.
  const { removeFiles } = useFileStorageStore();

  // [2]. Handlers
  // Used to remove the file from the state
  function removeFileOnClick() {
    removeFiles(instanceId, file.id);
  }

  // [3]. JSX
  return (
    <div className="flex overflow-hidden border-b-2 items-center relative gap-4 h-fit sm:text-left text-center w-full px-4 py-4">
      <File className="w-6 h-6 absolute top-1/2 left-2 -translate-y-1/2" />
      <Tooltip>
        <TooltipTrigger>
          <p className="text-xs w-full truncate line-clamp-1 overflow-hidden px-6">
            {truncateFileName(file.file.name, 40)}
          </p>
        </TooltipTrigger>
        <TooltipContent>
          <p>{file.file.name}</p>
        </TooltipContent>
      </Tooltip>
      <div className="z-50 absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center bg-background h-full">
        <X
          className="cursor-pointer w-6 h-6 text-primary"
          onClick={removeFileOnClick}
        />
      </div>
    </div>
  );
}

/**
 * @description A component that displays the details of the upload button.
 * @param {string} acceptedFileTypes - The accepted file types.
 * @param {number} maxFileCount - The maximum number of files that can be uploaded.
 * @param {string} maxFileSize - The maximum file size that can be uploaded.
 */
function ButtonDetails({
  acceptedFileTypes,
  maxFileCount,
  maxFileSize,
  minFileCount,
}: {
  acceptedFileTypes: string;
  maxFileCount: number;
  maxFileSize: string;
  minFileCount: number;
}) {
  // [1]. JSX
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center text-sm">
      <span className="text-center">Allowed type: {acceptedFileTypes}</span>
      <span className="text-center">
        Atleast {minFileCount > 1 ? minFileCount : 1} file(s)
      </span>
      {maxFileCount > 0 && (
        <span className="text-center">Atmost {maxFileCount} file(s)</span>
      )}
      <span className="text-center">Up to {maxFileSize} each</span>
    </div>
  );
}
