"use client";

import ToastButton from "@/registry/new-york/toast-button/toast-button";
import UTUILayout from "../layout";

export default function UTUIToastButton() {
  return (
    <UTUILayout>
      <ToastButton
        props={{ endpoint: "imageUploader" }}
        instanceId="toast-button"
        showDetails
      />
    </UTUILayout>
  );
}
