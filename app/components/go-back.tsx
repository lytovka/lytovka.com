import { Link } from "@remix-run/react";

function GoBack() {
  return (
    <Link
      className="text-black dark:text-white text-3xl no-underline opacity-50 hover:opacity-75 hover:border-b border-b-black dark:border-b-white transition-opacity"
      relative="path"
      to=".."
    >
      cd ..
    </Link>
  );
}

export default GoBack;
