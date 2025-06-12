import ActionButtonComponent from "@/registry/new-york/common/action-button/action-button";

export default function ActionButton({
  handleFileButtonClick,
  disabled,
  children,
}: {
  handleFileButtonClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ActionButtonComponent
      handleFileButtonClick={handleFileButtonClick}
      disabled={disabled}
    >
      {children}
    </ActionButtonComponent>
  );
}
