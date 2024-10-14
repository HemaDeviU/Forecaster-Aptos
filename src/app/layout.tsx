import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomMenu from '@/components/bottom-menu';
import Navbar from '@/components/navbar';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='mobile-container'>
          <Navbar />
          <div className="h-full p-4 items-center flex flex-col justify-center">
            {children}
          </div>
          <BottomMenu />
        </div>
      </body>
    </html>
  );
}
