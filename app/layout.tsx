import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

export const metadata: Metadata = {
  title: "Travel Flex Card — โชว์โลกที่คุณพิชิตมาแล้ว",
  description: "รวมทุกประเทศที่เคยไป ทริปที่จะไป และความทรงจำดี ๆ ไว้ในที่เดียว พร้อมการ์ดสวย ๆ แชร์ลง Story",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
