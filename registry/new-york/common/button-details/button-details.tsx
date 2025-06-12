/**
 * @description A component that displays the details of the upload button.
 * @param {string} acceptedFileTypes - The accepted file types.
 * @param {number} maxFileCount - The maximum number of files that can be uploaded.
 * @param {string} maxFileSize - The maximum file size that can be uploaded.
 */
export default function ButtonDetails({
  acceptedFileTypes,
  maxFileCount,
  maxFileSize,
  minFileCount,
}: {
  acceptedFileTypes: string;
  maxFileCount: number;
  maxFileSize: string;
  minFileCount: number;
}) {
  // [1]. JSX
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center text-sm">
      <span className="text-center">Allowed type: {acceptedFileTypes}</span>
      <span className="text-center">
        Atleast {minFileCount > 1 ? minFileCount : 1} file(s)
      </span>
      {maxFileCount > 0 && (
        <span className="text-center">Atmost {maxFileCount} file(s)</span>
      )}
      <span className="text-center">Up to {maxFileSize} each</span>
    </div>
  );
}
