import { ModeToggle } from "@/components/theme-toggle";
import { SheetClose } from "@/components/ui/sheet";
import { page_routes } from "@/lib/routes-config";
import { cn } from "@/lib/utils";
import { GithubIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AlgoliaSearch from "./algolia-search";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { buttonVariants } from "./ui/button";

export const NAVLINKS = [
  {
    title: "Documentation",
    href: `/docs${page_routes[0].href}`,
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Community",
    href: "https://github.com/webdevkaleem/uploadthingui/discussions",
  },
];

const algolia_props = {
  appId: process.env.ALGOLIA_APP_ID!,
  indexName: process.env.ALGOLIA_INDEX_NAME!,
  apiKey: process.env.ALGOLIA_API_KEY!,
};

export function Navbar() {
  return (
    <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center sm:justify-between md:gap-2">
        <div className="flex items-center sm:gap-5 gap-2.5">
          <SheetLeftbar />
          <div className="flex items-center gap-6">
            <Logo titleClassName="lg:flex md:hidden" />

            <div className="md:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center sm:justify-normal flex-row-reverse sm:flex-row justify-between sm:gap-3 ml-1 sm:w-fit w-[90%]">
          <AlgoliaSearch props={algolia_props} />
          <div className="items-center justify-between ml-auto sm:ml-0 sm:gap-2 hidden sm:flex">
            <div className="flex ml-4 sm:ml-0">
              <Link
                href="https://github.com/webdevkaleem/uploadthingui"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
              >
                <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo({ titleClassName }: { titleClassName?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      {/* <CommandIcon className="w-6 h-6 text-muted-foreground" strokeWidth={2} /> */}
      <Image src={"/favicon.ico"} width={24} height={24} alt="logo" />
      <h2 className={cn("text-md font-bold font-code text-primary", titleClassName)}>
        UploadthingUI
      </h2>
    </Link>
  );
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="text-primary! dark:font-medium font-semibold"
            absolute
            className="flex items-center gap-1 sm:text-sm text-[14.5px] dark:text-stone-300/85 text-stone-800"
            href={item.href}
          >
            {item.title}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
