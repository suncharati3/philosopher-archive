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
      className="group peer hidden md:block text-sidebar-foreground border-r border-border/40"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          className
        )}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar border-r border-border/40"
        >
          {children}
        </div>
      </div>
    </div>
  );
};