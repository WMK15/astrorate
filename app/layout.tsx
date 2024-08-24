import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "./context/SnackbarContext";
import StarryBackground from "./components/layout/StarryBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astrorate | Find the ratings of your professors",
  description: "Astrorate is a platform that helps students find the ratings of their professors.",
  metadataBase: new URL("https://astrorate.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://astrorate.vercel.app",
    title: "Astrorate | Find the ratings of your professors",
    description: "Astrorate is a platform that helps students find the ratings of their professors.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarProvider>
          <StarryBackground />
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}
