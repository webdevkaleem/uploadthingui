"use client";

import DropzoneDialog from "@/registry/new-york/dropzone-dialog/dropzone-dialog";
import UTUILayout from "../layout";
import { Button } from "@/components/ui/button";

export default function UTUIDropzoneDialogCustomActionButton() {
  return (
    <UTUILayout>
      <DropzoneDialog
        props={{ endpoint: "imageUploader" }}
        instanceId="dropzone-dialog-custom-action-button"
      >
        <Button>Custom Action Button</Button>
      </DropzoneDialog>
    </UTUILayout>
  );
}
