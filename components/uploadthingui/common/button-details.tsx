import ButtonDetailsComponent from "@/registry/new-york/common/button-details/button-details";

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
  return (
    <ButtonDetailsComponent
      acceptedFileTypes={acceptedFileTypes}
      maxFileCount={maxFileCount}
      maxFileSize={maxFileSize}
      minFileCount={minFileCount}
    />
  );
}
