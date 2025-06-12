"use client";

import ToastButton from "@/registry/new-york/toast-button/toast-button";
import UTUILayout from "../layout";

export default function UTUIToastButtonWithoutMetadata() {
  return (
    <UTUILayout>
      <ToastButton
        props={{ endpoint: "imageUploader" }}
        showDetails={false}
        instanceId="toast-button-without-metadata"
      />
    </UTUILayout>
  );
}
