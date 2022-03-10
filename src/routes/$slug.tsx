import { Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { Post } from "src/types/Post";
import PostStylesUrl from "src/styles/$slug.css";
import { getPost } from "src/utils/posts";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: PostStylesUrl,
    },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.slug) {
    throw "such a slug does not exist.";
  }
  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData<Post>();
  console.log("page", post);
  return (
    <>
      <nav className="navigation">
        <h1>{post.metadata.title}</h1>
        <Link to="/" className="navigation-close-link">
          <svg
            fill="currentColor"
            className="navigation-icon"
            height={15}
            width={15}
            viewBox="0 0 371.23 371.23"
          >
            <path d="m371.23 21.213-21.212-21.213-164.403 164.402-164.402-164.402-21.213 21.213 164.402 164.402-164.402 164.403 21.213 21.212 164.402-164.402 164.403 164.402 21.212-21.212-164.402-164.403z" />
          </svg>
        </Link>
      </nav>
      <article>
        <p className="last-edited-date">{post.metadata.date}</p>
        <div
          className="main-section"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </>
  );
}
