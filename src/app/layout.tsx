import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import FloatingIcons from "@/components/FloatingIcons";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AITimeline | The Evolution of AI",
  description: "A minimalist, developer-focused timeline exploring the milestones of Artificial Intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col items-center">
        <FloatingIcons />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
