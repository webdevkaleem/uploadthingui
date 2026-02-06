import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";
import { PostHogProvider } from "./providers";
import { Analytics } from "@vercel/analytics/next"

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "UploadthingUI",
  metadataBase: new URL("https://uploadthingui.vercel.app/"),
  description:
    "A set of beautifully-designed, accessible components for building uploadthing components. Built for Next.js with Shadcn Registry. Open Source. Open Code.",
  icons: [{ rel: "icon", url: "/uploadthingui_logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
        <meta name="algolia-site-verification" content="44949A465972B09B" />
      </head>
      <body
        className={`${sansFont.className} font-regular antialiased tracking-wide`}
        suppressHydrationWarning
      >
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <TooltipProvider>
              <Navbar />
              <Toaster />
              <main className="sm:container mx-auto w-[90vw] h-auto scroll-smooth">
                {children}
              </main>
              <Footer />
            </TooltipProvider>
          </ThemeProvider>
        </PostHogProvider>

        <Analytics />
      </body>
    </html>
  );
}
