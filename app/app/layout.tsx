import type { Metadata } from "next";
import Script from "next/script";
import { QueryProvider } from "@/lib/QueryProvider";
import { AuthProvider } from "@/lib/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { DarkModeProvider } from "@/lib/DarkModeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buddy Script",
  description: "Buddy Script",
  icons: {
    icon: "/images/logo-copy.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/common.css" />
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>
            <DarkModeProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </DarkModeProvider>
          </AuthProvider>
        </QueryProvider>
        <Script src="/js/bootstrap.bundle.min.js" />
        <Script src="/js/custom.js" />
      </body>
    </html>
  );
}
