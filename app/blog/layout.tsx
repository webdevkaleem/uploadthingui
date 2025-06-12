import { PropsWithChildren } from "react";

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col pt-8 pb-10 w-full mx-auto sm:min-h-[87.5vh] min-h-[82vh]">
      {children}
    </div>
  );
}
