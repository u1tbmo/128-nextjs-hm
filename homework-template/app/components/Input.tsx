"use client";

import type React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, ...rest }: Props) {
  return (
    <label className="space-y-1 text-sm text-slate-800">
      <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">{label}</span>
      <input
        {...rest}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
      />
    </label>
  );
}
