import { Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getPosts } from "~/utils/posts";
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
  return getPosts();
};

export default function Index() {
  const posts = useLoaderData<Array<Post>>();
  return (
    <div className="main-container">
      {posts.map((post) => (
        <Link key={post.slug} to={post.slug} className="folder-container">
          <img src={folder} aria-label="folder" />
          <p>{post.metadata.title}</p>
        </Link>
      ))}
    </div>
  );
}
