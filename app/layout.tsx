import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ShotPilot | Turn Your Camera Into a Pro Tool",
  description:
    "AI-powered video guidance based on your device. Get professional camera angles, shot lists, and settings in seconds.",
  openGraph: {
    title: "ShotPilot | Turn Your Camera Into a Pro Tool",
    description:
      "AI-powered video guidance based on your device. Get professional camera angles, shot lists, and settings in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Navbar />
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
