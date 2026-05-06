import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Nest Ecom Trang Chủ",
  description:
    "Trang chủ của Nest Ecom, nơi bạn có thể khám phá các sản phẩm và dịch vụ của chúng tôi. Chúng tôi cung cấp một loạt các sản phẩm chất lượng cao và dịch vụ tuyệt vời để đáp ứng nhu cầu của bạn. Hãy khám phá ngay hôm nay!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        spaceGrotesk.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
