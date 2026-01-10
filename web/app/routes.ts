import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("archive/prototype", "routes/archives/prototypes/prototype.tsx"),
  route("archive/prototype-v2", "routes/archives/prototypes/prototype-v2.tsx"),
  route("archive/prototype-v3", "routes/archives/prototypes/prototype-v3.tsx"),
  route("archive/prototype-v4", "routes/archives/prototypes/prototype-v4.tsx"),
  route("archive/prototype-v5", "routes/archives/prototypes/prototype-v5.tsx"),
  route("archive/prototype-v6", "routes/archives/prototypes/prototype-v6.tsx"),
] satisfies RouteConfig;
