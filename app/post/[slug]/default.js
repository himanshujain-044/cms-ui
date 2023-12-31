import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/container";
import { urlForImage } from "@/lib/sanity/image";
import { notFound } from "next/navigation";
import { parseISO, format } from "date-fns";
import { PortableText } from "@/lib/sanity/plugins/portabletext";

const AuthorCard = dynamic(() =>
  import("@/components/blog/authorCard")
);
const CategoryLabel = dynamic(() =>
  import("@/components/blog/category")
);
const AddCommentForm = dynamic(() =>
  import("@/components/comment/AddCommentForm")
);
const AllComments = dynamic(() =>
  import("@/components/comment/AllComments")
);

export default function Post(props) {
  const { loading, post } = props;
  const slug = post?.slug;
  const _id = post?._id;
  if (!loading && !slug) {
    notFound();
  }
  const imageProps = post?.mainImage
    ? urlForImage(post?.mainImage)
    : null;

  const AuthorimageProps = post?.author?.image
    ? urlForImage(post?.author.image)
    : null;

  return (
    <>
      <Container className="!pt-0">
        <div className="mx-auto max-w-screen-md ">
          <div className="flex justify-center">
            <CategoryLabel categories={post?.categories} />
          </div>

          <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            {post?.title}
          </h1>

          <div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                {AuthorimageProps && (
                  <Link href={`/author/${post?.author.slug.current}`}>
                    <Image
                      src={AuthorimageProps.src}
                      alt={post?.author?.name}
                      className="rounded-full object-cover"
                      fill
                      sizes="40px"
                    />
                  </Link>
                )}
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-400">
                  {post.author && (
                    <Link
                      href={`/author/${post?.author.slug.current}`}>
                      {post?.author.name}
                    </Link>
                  )}
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <time
                    className="text-gray-500 dark:text-gray-400"
                    dateTime={post?.publishedAt || post?._createdAt}>
                    {format(
                      parseISO(post?.publishedAt || post?._createdAt),
                      "MMMM dd, yyyy"
                    )}
                  </time>
                  <span>
                    · {post?.estReadingTime || "5"} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
        {imageProps && (
          <Image
            src={imageProps.src}
            alt={post?.mainImage?.alt || "Thumbnail"}
            loading="eager"
            fill
            sizes="80vw"
            className="object-cover"
            priority="true"
          />
        )}
      </div>
      <Container>
        <article className="mx-auto max-w-screen-md ">
          <div className="prose mx-auto my-3 dark:prose-invert prose-a:text-blue-600">
            {post?.body && <PortableText value={post?.body} />}
          </div>
          <div className="mb-7 mt-7 flex justify-center">
            <Link
              href="/"
              className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 ">
              ← View all posts
            </Link>
          </div>
          {post?.author && <AuthorCard author={post?.author} />}
        </article>
      </Container>
      <Container
        id="comments"
        className="mt-3 rounded-2xl bg-gray-50 px-8 py-8 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        <h2 className="my-2 w-full text-3xl ">Comments</h2>
        {_id ? <AddCommentForm _id={_id} /> : <>Loading...</>}
        {_id ? <AllComments _id={_id} /> : <>Loading...</>}
      </Container>{" "}
    </>
  );
}

const MainImage = ({ image }) => {
  return (
    <div className="mb-12 mt-12 ">
      <Image {...urlForImage(image)} alt={image.alt || "Thumbnail"} />
      <figcaption className="text-center ">
        {image.caption && (
          <span className="text-sm italic text-gray-600 dark:text-gray-400">
            {image.caption}
          </span>
        )}
      </figcaption>
    </div>
  );
};
