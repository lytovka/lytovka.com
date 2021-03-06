import {
  Link,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import PostStylesUrl from "~/styles/$slug.css";
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
      <div className="navigation-container">
        <nav className="navigation">
          <div className="navigation-items-container">
            <h1>{post.title}</h1>
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
          </div>
        </nav>
      </div>
      <article className="main-section">
        <p className="main-section-date-edited">{postDate}</p>
        <div
          className="main-section-text"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </>
  );
}
