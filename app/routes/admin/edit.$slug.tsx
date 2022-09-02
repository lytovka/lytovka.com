import { redirect, json } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { Form, useLoaderData } from "@remix-run/react";
import type { PostUpdate } from "~/types/Post";
import { editPost, getPostRaw } from "~/utils/posts.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const markdown = formData.get("markdown") as string;
  const slug = formData.get("slug") as string;

  if (!title || !markdown || !slug) return json("Some fields are missing");

  await editPost(id, { title, markdown, slug });

  return redirect("/admin");
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.slug) throw "`params.slug` was not found";
  if (process.env.NODE_ENV !== "development") return redirect("/");

  return await getPostRaw(params.slug);
};

export default function EditPost() {
  const data = useLoaderData<PostUpdate>();
  return (
    <Form method="post">
      <input type="hidden" name="id" value={data.id} />
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" defaultValue={data.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: <input type="text" name="slug" defaultValue={data.slug} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          defaultValue={data.markdown}
        />
      </p>
      <p>
        <button type="submit">Update Post</button>
      </p>
    </Form>
  );
}
