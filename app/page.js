import HomePage from "../components/home";
import { getAllPosts } from "@/lib/sanity/client";
export const runtime = "edge"; // 'nodejs' (default) | 'edge'
export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}
export const revalidate = 10;
