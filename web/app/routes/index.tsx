import { redirect } from "react-router";
import type { Route } from "./+types/index";

export function loader({}: Route.LoaderArgs) {
  return redirect("/trips");
}

export default function IndexRoute() {
  return null;
}
