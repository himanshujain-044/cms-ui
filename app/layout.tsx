import "@/styles/tailwind.css";
import { Providers } from "../components/providers";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";
import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/cookiebanner";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});
export const revalidate = 10;

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(inter.variable, lora.variable)}>
      <head>
        <meta
          name="p:domain_verify"
          content="23e3bb1046c70a90bcfe8630e33f96e3"
        />
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        )}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-W5ZKTJY3EP" />
      </head>
      <body
        suppressHydrationWarning={true}
        className="text-gray-800 antialiased dark:bg-black dark:text-gray-400">
        <Providers>
          <Navbar {...settings} />
          <div>{children}</div>
          <Footer {...settings} />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
