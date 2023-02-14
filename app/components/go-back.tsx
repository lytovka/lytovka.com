import { Link } from "@remix-run/react";
import { useNavigation } from "react-router";

function GoBack() {
  const navigation = useNavigation();
  const back = navigation.location
    ? navigation.location.pathname.split("/").slice(0, -1).join("/")
    : "/";

  return (
    <Link
      className="text-white text-3xl font-mono no-underline opacity-50 hover:opacity-75 hover:border-b transition-opacity"
      to={back}
    >
      cd ..
    </Link>
  );
}

export default GoBack;
