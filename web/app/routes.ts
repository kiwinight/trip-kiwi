import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),

  // Prototype v8 (Kiwizard)
  layout("routes/prototype-v8/_layout.tsx", [
    route("prototype-v8", "routes/prototype-v8/index.tsx"),
    route("prototype-v8/feed", "routes/prototype-v8/feed.tsx"),
    route("prototype-v8/profile", "routes/prototype-v8/profile.tsx"),
  ]),

  // Archives
  route("archive/prototype", "routes/archives/prototypes/prototype.tsx"),
  route("archive/prototype-v2", "routes/archives/prototypes/prototype-v2.tsx"),
  route("archive/prototype-v3", "routes/archives/prototypes/prototype-v3.tsx"),
  route("archive/prototype-v4", "routes/archives/prototypes/prototype-v4.tsx"),
  route("archive/prototype-v5", "routes/archives/prototypes/prototype-v5.tsx"),
  route("archive/prototype-v6", "routes/archives/prototypes/prototype-v6.tsx"),
  route("archive/prototype-v7", "routes/archives/prototypes/prototype-v7.tsx"),
] satisfies RouteConfig;
