import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Woo App by Next",
    template: "%s | Woo App by Next",
  },
  description: "A small Next.js learning application.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <header className="bg-slate-800 px-6 py-4 text-white">
          <nav aria-label="Main navigation">
            <ul className="flex flex-wrap gap-6">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/post">Post</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
