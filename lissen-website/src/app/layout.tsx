"use client";

import { useEffect } from "react";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import TRPCProvider from "@/lib/trpc/Provider";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { FacebookPixelEvents } from "@/components/PixelEvents";
import IntercomClientComponent from "@/components/IntercomClientComponent";
import { AuthProvider } from "@/lib/firebase/auth-context";
import LoginModal from "@/components/LoginModal";
import dayjs from "dayjs";
import en from "dayjs/locale/en";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

dayjs.locale({
  ...en,
  weekStart: 1,
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const residenzGrotesk = localFont({
  src: "../../public/fonts/ResidenzGroteskTrial-BoldWide.otf",
  variable: "--font-residenz-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head></head>
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased dark flex flex-col`,
          fontSans.variable,
          residenzGrotesk.variable,
        )}
      >
        <Suspense fallback={null}>
          <TRPCProvider>
            <AuthProvider>
              <Header />
              <LoginModal />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
            </AuthProvider>
          </TRPCProvider>

          <FacebookPixelEvents />
        </Suspense>
        <IntercomClientComponent />
      </body>
    </html>
  );
}
