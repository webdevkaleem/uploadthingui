"use client";

import DropzoneDialog from "@/registry/new-york/dropzone-dialog/dropzone-dialog";
import UTUILayout from "../layout";

export default function UTUIDropzoneDialogRouteDetails() {
  return (
    <UTUILayout>
      <DropzoneDialog
        props={{ endpoint: "imageUploader" }}
        instanceId="dropzone-dialog-route-details"
        routeDetails={{
          maxFileCount: 5,
          minFileCount: 2,
        }}
      />
    </UTUILayout>
  );
}
