"use client";

import AddPlantForm from "./AddPlantForm";
import PlantGrid from "./PlantGrid";
import { usePlants } from "../hooks/usePlants";
import type { PlantStatus } from "@/types";

export default function PlantDashboard() {
  const {
    plants,
    loading,
    error,
    setError,
    locationFilter,
    setLocationFilter,
    busyId,
    summary,
    createPlant,
    updatePlant,
    deletePlant,
  } = usePlants();

  const handleStatusChange = async (id: string, status: PlantStatus) => {
    await updatePlant(id, { status });
  };

  const handleWaterNow = async (id: string) => {
    await updatePlant(id, { status: "Healthy", lastWatered: new Date() });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            Plant Care Tracker
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold sm:text-3xl">Manage your plants</h1>
              <p className="text-sm text-slate-600">
                Uses the /api/plants endpoints to list, create, update status/lastWatered, and delete plants.
              </p>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2 text-sm text-slate-800">
              <Badge label="Total" value={summary.total} tone="slate" />
              <Badge label="Healthy" value={summary.healthy} tone="emerald" />
              <Badge label="Thirsty" value={summary.thirsty} tone="amber" />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <PlantGrid
            plants={plants}
            loading={loading}
            error={error}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
            busyId={busyId}
            onStatusChange={handleStatusChange}
            onWaterNow={handleWaterNow}
            onDelete={deletePlant}
          />

          <AddPlantForm onCreate={createPlant} busy={busyId === "new"} onError={setError} />
        </section>
      </main>
    </div>
  );
}

function Badge({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "emerald" | "amber";
}) {
  const styles = {
    slate: "bg-slate-100 text-slate-800 ring-slate-200",
    emerald: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    amber: "bg-amber-100 text-amber-800 ring-amber-200",
  } as const;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[tone]}`}>
      <span className="h-2 w-2 rounded-full bg-current opacity-80" aria-hidden />
      {label}: {value}
    </span>
  );
}
