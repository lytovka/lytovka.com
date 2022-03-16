import {
  Link,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import PostStylesUrl from "../../styles/$slug.css";
import formatDate from "date-fns/format";
import { Post } from "~/types/Post";
import { getPost } from "~/utils/posts.server";

type LoaderData = Post;

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: PostStylesUrl,
    },
  ];
};

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
  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  const postDate = formatDate(new Date(post.date), "dd/MM/yyyy");
  return (
    <>
      <div className="h-navbar">
        <nav className="bg-background w-full top-0 py-2 px-5 border-solid border-b border-b-gray-200 fixed">
          <div className="flex justify-center mx-auto max-w-main-content items-center">
            <h1 className="text-3xl lg:text-4xl flex-grow text-center">
              {post.title}
            </h1>
            <Link
              to="/"
              className="group flex justify-center items-center w-12 h-12 transition-all duration-200 hover:bg-red-300 hover:rounded-full"
            >
              <svg
                className="fill-white transition group-hover:fill-black"
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
      <article className="px-1 py-8 lg:pt-16 lg:px-32 lg:pb-8 lg:max-w-main-content lg:mx-auto">
        <p className="main-section-date-edited">{postDate}</p>
        <div
          className="main-section-text"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </>
  );
}
