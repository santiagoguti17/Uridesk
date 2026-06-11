import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const interMono = Geist_Mono({
  variable: "--font-inter-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uridesk",
  description: "Plataforma de soporte y gestión para Uridesk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${interSans.variable} ${interMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
