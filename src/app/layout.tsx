import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-client-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Playfair, Roboto_Mono } from "next/font/google";
import "./globals.css";

const playFair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800", "900"],
});

const roboto = Roboto_Mono({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "200"],
});

export const metadata: Metadata = {
  title: "Neura",
  description: "Aprenda mais rápido. Lembre-se para sempre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playFair.className} ${roboto.variable} antialiased min-h-dvh bg-linear-to-br from-slate-50 via-slate-100 to-slate-300 dark:from-slate-950 dark:via-slate-700 dark:to-slate-950`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
