"use client";

import PlantCard from "./PlantCard";
import type { Plant, PlantStatus } from "@/types";

type Props = {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  busyId: string | null;
  onStatusChange: (id: string, status: PlantStatus) => void | Promise<void>;
  onWaterNow: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export default function PlantGrid({
  plants,
  loading,
  error,
  locationFilter,
  onLocationChange,
  busyId,
  onStatusChange,
  onWaterNow,
  onDelete,
}: Props) {
  const uniqueLocations = [...new Set(plants.map((p) => p.location))];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
        <label className="text-sm">Filter by location</label>
        <select
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
        >
          <option value="*">All spaces</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {loading && <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">Refreshing…</span>}
        {error && <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">{error}</span>}
      </div>

      <div className="mt-4 space-y-3">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            busy={busyId === plant.id}
            onStatusChange={onStatusChange}
            onWaterNow={(id) => onWaterNow(id)}
            onDelete={onDelete}
          />
        ))}

        {!loading && plants.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
            No plants yet. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
