"use client";

import DropzoneDialog from "@/registry/new-york/dropzone-dialog/dropzone-dialog";
import UTUILayout from "../layout";

export default function UTUIDropzoneDialogWithoutMetadata() {
  return (
    <UTUILayout>
      <DropzoneDialog
        props={{ endpoint: "imageUploader" }}
        instanceId="dropzone-dialog-without-metadata"
        showDetails={false}
      />
    </UTUILayout>
  );
}
