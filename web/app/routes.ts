import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("prototype", "routes/prototype.tsx"),
  route("prototype-v2", "routes/prototype-v2.tsx"),
  route("prototype-v3", "routes/prototype-v3.tsx"),
  route("prototype-v4", "routes/prototype-v4.tsx"),
  route("prototype-v5", "routes/prototype-v5.tsx"),
  route("prototype-v6", "routes/prototype-v6.tsx"),
  route("prototype-v7", "routes/prototype-v7.tsx"),
  route("trips", "routes/trips.tsx", [
    index("routes/trips._index.tsx"),
    route(":tripId", "routes/trips.$tripId.tsx", [
      index("routes/trips.$tripId._index.tsx"),
      route("plans/:planId", "routes/trips.$tripId.plans.$planId.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
