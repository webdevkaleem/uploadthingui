"use client";

import ToastButton from "@/registry/new-york/toast-button/toast-button";
import UTUILayout from "../layout";

export default function UTUIToastButtonRouteDetails() {
  return (
    <UTUILayout>
      <ToastButton
        props={{ endpoint: "imageUploader" }}
        instanceId="toast-button-route-details"
        showDetails
        routeDetails={{ minFileCount: 2, maxFileCount: 5 }}
      />
    </UTUILayout>
  );
}
