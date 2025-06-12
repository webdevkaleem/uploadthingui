import { utapi } from "@/server/uploadthing";
import { waitUntil } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("uploadthing_secure_server_token");

  // Authenticate the request
  if (authHeader !== process.env.uploadthing_secure_server_token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const fileUploadKeysArr = (await utapi.listFiles()).files.map(
    (file) => file.key
  );
  // If there are no files to delete, return a default message
  if (fileUploadKeysArr.length === 0) {
    return NextResponse.json(
      { message: "No files to delete" },
      { status: 200 }
    );
  }

  // Deleting all the files
  waitUntil(utapi.deleteFiles(fileUploadKeysArr));

  return NextResponse.json(
    {
      message: `Successfully deleted ${fileUploadKeysArr.length} file${
        fileUploadKeysArr.length === 1 ? "" : "s"
      }`,
    },
    { status: 200 }
  );
}
