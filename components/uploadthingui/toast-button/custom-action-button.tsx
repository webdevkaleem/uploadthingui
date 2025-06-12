"use client";

import ToastButton from "@/registry/new-york/toast-button/toast-button";
import UTUILayout from "../layout";
import { Button } from "@/components/ui/button";

export default function UTUIToastButtonCustomActionButton() {
  return (
    <UTUILayout>
      <ToastButton
        props={{ endpoint: "imageUploader" }}
        instanceId="toast-button-custom-action-button"
      >
        <Button>Custom Action Button</Button>
      </ToastButton>
    </UTUILayout>
  );
}
