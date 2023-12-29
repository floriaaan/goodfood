import "@/styles/globals.css";

import type { Metadata } from "next";

import { RootProviders } from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Goodfood",
  description: "Goodfood",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={cn("flex h-full min-h-screen flex-col", inter.className)}>
        <NextTopLoader color="black" zIndex={100} showSpinner={false} />
        <RootProviders>{children}</RootProviders>
        <Toaster />
      </body>
    </html>
  );
}
