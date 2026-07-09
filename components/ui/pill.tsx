import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PillTone = "glass" | "lime" | "strong" | "partial" | "weak";

type PillProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: PillTone;
  dotColor?: string;
  children: ReactNode;
};

export function Pill({
  children,
  className,
  dotColor,
  tone = "glass",
  ...props
}: PillProps) {
  return (
    <span className={cn("ui-pill", `ui-pill--${tone}`, className)} {...props}>
      {dotColor ? <span className="ui-pill__dot" style={{ background: dotColor }} /> : null}
      {children}
    </span>
  );
}