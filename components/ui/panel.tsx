import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PanelProps = HTMLAttributes<HTMLElement> & {
  tone?: "light" | "dark";
};

export function Panel({ className, tone = "light", ...props }: PanelProps) {
  return <section className={cn("ui-panel", `ui-panel--${tone}`, className)} {...props} />;
}