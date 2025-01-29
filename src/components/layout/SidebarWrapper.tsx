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
    <div
      className={cn(
        "h-full flex-shrink-0 bg-background border-r border-border/40",
        className
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      <div
        data-sidebar="sidebar"
        className="flex h-full w-full flex-col"
      >
        {children}
      </div>
    </div>
  );
};