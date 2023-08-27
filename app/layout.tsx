import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(inter.variable, lora.variable)}>
      {" "}
      <meta
        name="p:domain_verify"
        content="23e3bb1046c70a90bcfe8630e33f96e3"
      />
      <head></head>
      <body
        suppressHydrationWarning={true}
        className="text-gray-800 antialiased dark:bg-black dark:text-gray-400">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
