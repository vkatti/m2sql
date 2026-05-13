import type { Metadata }       from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Toaster }             from "@/components/ui/sonner";
import { Providers }           from "./providers";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M2SQL - Power Query to SQL Translator",
  description: "Translate Power Query (M) code into optimized Microsoft SQL Server T-SQL queries using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
