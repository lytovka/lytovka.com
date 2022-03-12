import { LoaderFunction, useLoaderData } from "remix";
import { getPost } from "~/utils/posts.server";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.slug) throw "`params.slug` was not found";

  return await getPost(params.slug);
};

export default function EditPost() {
  const data = useLoaderData();
  console.log(data);
  return <h2>edit Post</h2>;
}
