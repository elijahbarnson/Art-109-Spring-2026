import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Self Chatbot Builder",
  description: "Create a personal corpus and chat with a simple simulated version of yourself.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
