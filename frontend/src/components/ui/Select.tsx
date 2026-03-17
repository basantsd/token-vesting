"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
}: SelectProps) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-text-2)",
            marginBottom: "0.5rem",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            height: "2.5rem",
            padding: "0 2.5rem 0 0.875rem",
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border-1)",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            color: value ? "var(--color-text-1)" : "var(--color-text-3)",
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-emerald)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-border-1)")
          }
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option
              key={o.value}
              value={o.value}
              style={{ background: "var(--color-bg-card)" }}
            >
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-3)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
