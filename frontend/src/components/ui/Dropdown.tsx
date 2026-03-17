"use client";
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const Dropdown = DropdownMenuPrimitive.Root;
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownContent({
  children,
  align = "end",
}: {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={6}
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border-2)",
          borderRadius: "10px",
          padding: "0.375rem",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          zIndex: 150,
          minWidth: "180px",
          animation: "slideUp 150ms ease",
          outline: "none",
        }}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger,
  disabled,
}: DropdownItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.5rem 0.75rem",
        borderRadius: "6px",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: danger ? "var(--color-red)" : "var(--color-text-2)",
        cursor: "pointer",
        outline: "none",
        transition: "all 120ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--color-bg-elevated)";
        e.currentTarget.style.color = danger
          ? "var(--color-red)"
          : "var(--color-text-1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = danger
          ? "var(--color-red)"
          : "var(--color-text-2)";
      }}
    >
      {icon && (
        <span style={{ color: "inherit", flexShrink: 0 }}>{icon}</span>
      )}
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownSeparator() {
  return (
    <DropdownMenuPrimitive.Separator
      style={{
        height: "1px",
        background: "var(--color-border-1)",
        margin: "0.375rem 0",
      }}
    />
  );
}
