"use client";

import ToastButton from "@/registry/new-york/toast-button/toast-button";
import UTUILayout from "../layout";

export default function UTUIToastButtonAllowInBetweenUploads() {
  return (
    <UTUILayout>
      <ToastButton
        props={{ endpoint: "imageUploader" }}
        instanceId="toast-button-allow-in-between-uploads"
        allowInBetweenUploads={false}
      />
    </UTUILayout>
  );
}
