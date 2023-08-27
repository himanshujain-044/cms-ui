import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";

import Navbar from "@/components/navbar";

export default async function Layout({ children, params }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar {...settings} />
      <div>{children}</div>
      <Footer {...settings} />
    </>
  );
}
// enable revalidate for all pages in this layout
export const revalidate = 10;
