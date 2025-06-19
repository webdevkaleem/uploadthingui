import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import { type OurFileRouter } from "./uploadthingui-types";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

// Export a type that users can extend if needed
export type FileRouter = OurFileRouter;