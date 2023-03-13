import { Link } from "@remix-run/react";

function GoBack() {
  return (
    <Link
      className="text-white text-3xl font-mono no-underline opacity-50 hover:opacity-75 hover:border-b transition-opacity"
      relative="path"
      to=".."
    >
      cd ..
    </Link>
  );
}

export default GoBack;
