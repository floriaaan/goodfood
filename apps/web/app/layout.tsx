import { RootProviders } from "@/app/providers";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
