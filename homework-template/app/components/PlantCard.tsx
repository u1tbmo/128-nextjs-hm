"use client";

import type { Plant, PlantStatus } from "@/types";

const STATUS_OPTIONS: PlantStatus[] = ["Healthy", "Thirsty", "Overwatered"];
const statusTone: Record<PlantStatus, string> = {
  Healthy: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Thirsty: "bg-amber-50 text-amber-800 border-amber-200",
  Overwatered: "bg-sky-50 text-sky-800 border-sky-200",
};

type Props = {
  plant: Plant;
  busy: boolean;
  onStatusChange: (id: string, status: PlantStatus) => void | Promise<void>;
  onWaterNow: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export default function PlantCard({ plant, busy, onStatusChange, onWaterNow, onDelete }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-base font-semibold uppercase text-emerald-800">
            {plant.name[0]?.toUpperCase() ?? ""}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">{plant.name}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{plant.location}</span>
            </div>
            <p className="text-sm text-slate-600">{plant.species}</p>
            <p className="text-xs text-slate-500">Last watered {new Date(plant.lastWatered).toLocaleDateString()}</p>
          </div>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[plant.status]}`}>
          {plant.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <select
          value={plant.status}
          onChange={(e) => onStatusChange(plant.id, e.target.value as PlantStatus)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
          disabled={busy}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={() => onWaterNow(plant.id)}
          disabled={busy}
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
        >
          Mark watered now
        </button>
        <button
          onClick={() => onDelete(plant.id)}
          disabled={busy}
          className="ml-auto rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
