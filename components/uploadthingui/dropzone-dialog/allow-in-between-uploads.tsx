"use client";

import DropzoneDialog from "@/registry/new-york/dropzone-dialog/dropzone-dialog";
import UTUILayout from "../layout";

export default function UTUIDropzoneDialogAllowInBetweenUploads() {
  return (
    <UTUILayout>
      <DropzoneDialog
        props={{ endpoint: "imageUploader" }}
        instanceId="dropzone-dialog-allow-in-between-uploads"
        allowInBetweenUploads={false}
      />
    </UTUILayout>
  );
}
