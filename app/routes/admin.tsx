import {
  Link,
  LinksFunction,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from "remix";
import { Post } from "~/types/Post";
import { getMarkdownPostsPreview } from "~/utils/posts.server";
import AdminStyles from "~/styles/admin.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: AdminStyles,
    },
  ];
};

export const loader: LoaderFunction = async () => {
  if (process.env.NODE_ENV !== "development") return redirect("/");

  return await getMarkdownPostsPreview();
};

export default function Admin() {
  const posts = useLoaderData<Array<Post>>();
  return (
    <div className="admin-container">
      <nav>
        <h1>Admin</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/admin/edit/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
