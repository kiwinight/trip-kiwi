import * as React from "react";
import { Textarea as ShadcnTextarea } from "../shadcn-ui/textarea";
import { cn } from "~/libs/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof ShadcnTextarea>) {
  return <ShadcnTextarea className={cn("text-base!", className)} {...props} />;
}

export { Textarea };
