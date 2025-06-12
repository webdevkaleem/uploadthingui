import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

/**
 * @description A conditional button component that will render a custom button component if provided, otherwise it will render a default button component.
 * @param {function} handleFileButtonClick - Function to handle the file button click event.
 * @param {boolean} disabled - Whether to disable the button.
 * @param {React.ReactNode} children - React node to render a custom button component.
 */
export default function ActionButton({
  handleFileButtonClick,
  disabled,
  children,
}: {
  handleFileButtonClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  // If a custom button has returned then render that and attach the onClick handler to it
  if (children) {
    return <div onClick={handleFileButtonClick}>{children}</div>;
  }

  // Otherwise render the default button component
  return (
    <Button
      className="w-fit"
      onClick={handleFileButtonClick}
      disabled={disabled}
    >
      <Upload className="w-4 h-4" />
      <span className="ml-2">Upload</span>
    </Button>
  );
}
