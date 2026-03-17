"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ open, onClose, children, size = "md" }: ModalProps) {
  const widths = { sm: "420px", md: "560px", lg: "720px" };
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            animation: "fadeIn 150ms ease",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: `min(${widths[size]}, calc(100vw - 2rem))`,
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border-2)",
            borderRadius: "12px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            zIndex: 101,
            animation: "slideUp 200ms ease",
            outline: "none",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-3)",
              transition: "color 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-1)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
          >
            <X size={16} />
          </button>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "1.5rem 1.5rem 0" }}>{children}</div>;
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "1.125rem",
        fontWeight: 700,
        color: "var(--color-text-1)",
        letterSpacing: "-0.02em",
        marginBottom: "0.375rem",
      }}
    >
      {children}
    </h2>
  );
}

export function ModalDescription({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.875rem", color: "var(--color-text-2)", lineHeight: 1.6 }}>
      {children}
    </p>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "1.25rem 1.5rem" }}>{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "0 1.5rem 1.5rem",
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.625rem",
      }}
    >
      {children}
    </div>
  );
}
