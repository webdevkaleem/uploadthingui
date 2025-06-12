export default function UTUILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-32 px-16 py-32 flex items-center justify-center border-2 border-dashed rounded-md">
      {children}
    </div>
  );
}
