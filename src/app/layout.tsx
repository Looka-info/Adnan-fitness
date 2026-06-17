import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adnan Fitness Club - Premium Gym Member Management",
  description: "Transform your fitness business with Adnan Fitness Club's comprehensive member management system. Track memberships, automate payments, and manage gym operations efficiently.",
  keywords: ["Fitness Club", "Gym Management Software", "Member Tracking", "Adnan Fitness", "Gym Billing", "Membership Management", "Fitness Business"],
  authors: [{ name: "Adnan Fitness Club" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Adnan Fitness Club - Premium Member Management",
    description: "Professional gym member management with automated dues tracking and payment reminders",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adnan Fitness Club - Premium Member Management",
    description: "Professional gym member management with automated dues tracking and payment reminders",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
