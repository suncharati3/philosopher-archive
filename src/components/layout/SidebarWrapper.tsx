import { cn } from "@/lib/utils";
import React from "react";

interface SidebarWrapperProps {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
  state: "expanded" | "collapsed";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export const SidebarWrapper = ({
  children,
  className,
  side = "left",
  state,
  variant = "sidebar",
  collapsible = "offcanvas",
}: SidebarWrapperProps) => {
  return (
    <aside
      className={cn(
        "h-full w-[280px] flex-shrink-0 border-r border-border/40",
        className
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      <div className="flex h-full w-full flex-col">
        {children}
      </div>
    </aside>
  );
};