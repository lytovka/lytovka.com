import { Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getMarkdownPostsPreview } from "~/utils/posts.server";
import { Post } from "~/types/Post";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: indexStylesUrl,
    },
  ];
};

export const loader: LoaderFunction = async () => {
  const data = await getMarkdownPostsPreview();
  console.log({ data });
  return data;
};

export default function Index() {
  const posts = useLoaderData<Array<Post>>();
  return (
    <div className="main-container">
      {posts.map((post) => (
        <Link
          prefetch="intent"
          key={post.slug}
          to={post.slug}
          className="folder-container"
        >
          <img src={folder} aria-label="folder" />
          <p>{post.title}</p>
        </Link>
      ))}
    </div>
  );
}
