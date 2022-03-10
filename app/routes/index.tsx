import {
  Link,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import indexStylesUrl from "~/styles/index.css";
import folder from "~/images/home_folder.png";
import { getPosts } from "~/utils/postsFromDb";
import { Post } from "~/types/Post";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: indexStylesUrl,
    },
  ];
};

export const meta: MetaFunction = () => ({
  title: "Ivan's desktop",
  description: "Sharing thoughts with you",
});

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
          <p>{post.title}</p>
        </Link>
      ))}
    </div>
  );
}
