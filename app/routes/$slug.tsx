import type { LoaderFunction, MetaFunction } from "remix";
import { json } from "remix";
import { Link, useLoaderData } from "@remix-run/react";
import formatDate from "date-fns/format";
import type { Post } from "~/typings/Post";
import { getPost } from "~/utils/posts.server";

type LoaderData = Post;

export const meta: MetaFunction = ({ data }: { data: LoaderData | null }) => {
  if (!data) {
    return {
      title: "No post",
      description: "No post found",
    };
  }
  return {
    title: `"${data.title}" post`,
    description: "What should I put here?",
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.slug) {
    throw "such a slug does not exist.";
  }
  return json(await getPost(params.slug));
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  const postDate = formatDate(new Date(post.date), "dd/MM/yyyy");
  return (
    <>
      <div className="h-24">
        <nav className="fixed top-0 w-full bg-main border-solid border-b border-gray-400 py-5 px-5">
          <div className="flex items-center mx-auto max-w-8xl md:px-32">
            <h1 className="flex-grow font-bold text-3xl text-center">
              {post.title}
            </h1>
            <Link
              to="/"
              className="group flex justify-center items-center w-10 h-10 duration-200 hover:bg-red-300 rounded-full"
            >
              <svg
                fill="currentColor"
                className="fill-white duration-200 group-hover:fill-black"
                height={15}
                width={15}
                viewBox="0 0 371.23 371.23"
              >
                <path d="m371.23 21.213-21.212-21.213-164.403 164.402-164.402-164.402-21.213 21.213 164.402 164.402-164.402 164.403 21.213 21.212 164.402-164.402 164.403 164.402 21.212-21.212-164.402-164.403z" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
      <article className="py-4 px-8 md:py-8 md:px-32 md:max-w-8xl md:mx-auto">
        <p className="flex justify-end text-xl mb-3 italic">{postDate}</p>
        <div
          className="prose max-w-none text-3xl mb-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </>
  );
}
