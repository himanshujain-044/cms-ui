import "@/styles/tailwind.css";
import dynamic from "next/dynamic";
import { Providers } from "../components/providers";
import { cx } from "@/utils/all";
import { Inter, Lora } from "next/font/google";
import { getSettings } from "@/lib/sanity/client";
import GoogleAnalytics from "@/components/GoogleAnalytics";
const Navbar = dynamic(() => import("@/components/navbar"));
const CookieBanner = dynamic(
  () => import("@/components/cookiebanner")
);
const Footer = dynamic(() => import("@/components/footer"));
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
          content="3a0692f26b4ae61a2bdbf7d7dcfa99da"
        />
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        )}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-5J9R9S1DE4" />
      </head>
      <body
        suppressHydrationWarning={true}
        className="text-gray-800 antialiased dark:bg-black dark:text-gray-400">
        <Providers>
          <Navbar {...settings} />
          {children}
          <Footer {...settings} />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
