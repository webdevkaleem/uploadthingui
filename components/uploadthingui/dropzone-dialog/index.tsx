"use client";

import DropzoneDialog from "@/registry/new-york/dropzone-dialog/dropzone-dialog";
import UTUILayout from "../layout";

export default function UTUIDropzoneDialog() {
  return (
    <UTUILayout>
      <DropzoneDialog
        props={{
          endpoint: "imageUploader",
        }}
        instanceId="dropzone-dialog"
      />
    </UTUILayout>
  );
}
