import { type ExpandedRouteConfig, type FileRouterInputKey } from "@uploadthing/shared";

export function getFileSizeFormatted(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// Return the objects value
export function checkFileObjectKey({
  str,
  obj,
}: {
  str: FileRouterInputKey | undefined;
  obj: ExpandedRouteConfig | undefined;
}) {
  if (!str || !obj) return null;

  if (obj && typeof obj === "object" && obj.hasOwnProperty(str)) {
    return obj[str];
  } else {
    return null;
  }
}

/**
 * @description A utility function that truncates the file name to a maximum number of characters.
 * @param {string} fileName - The file name to truncate.
 * @param {number} maxChars - The maximum number of characters to truncate the file name to. Default is 24.
 * @returns {string} The truncated file name.
 */
export function truncateFileName(fileName: string, maxChars?: number) {
  if (fileName.length > 20) {
    return `${fileName.slice(0, maxChars ?? 24)}...`;
  }
  return fileName;
}
