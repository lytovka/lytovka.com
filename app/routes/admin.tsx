import { Link, LoaderFunction, Outlet, redirect, useLoaderData } from "remix";
import { Post } from "~/types/Post";
import { getPosts } from "~/utils/posts.server";

export const loader: LoaderFunction = async () => {
  if (process.env.NODE_ENV !== "development") redirect("/");

  return await getPosts();
};

export default function Admin() {
  const posts = useLoaderData<Array<Post>>();
  return (
    <div className="admin">
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
