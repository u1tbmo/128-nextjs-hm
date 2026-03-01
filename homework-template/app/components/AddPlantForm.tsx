"use client";

import { useState } from "react";
import Input from "./Input";
import type { Plant } from "@/types";

type CreatePlantInput = Pick<Plant, "name" | "species" | "location">;

type Props = {
  onCreate: (input: CreatePlantInput) => Promise<void> | void;
  busy: boolean;
  onError?: (message: string | null) => void;
};

const initialForm: CreatePlantInput = {
  name: "",
  species: "",
  location: "",
};

export default function AddPlantForm({ onCreate, busy, onError }: Props) {
  const [form, setForm] = useState<CreatePlantInput>(initialForm);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.species.trim() || !form.location.trim()) {
      const message = "Please fill name, species, and location.";
      setLocalError(message);
      onError?.(message);
      return;
    }

    setLocalError(null);
    onError?.(null);

    try {
      await onCreate({
        name: form.name.trim(),
        species: form.species.trim(),
        location: form.location.trim(),
      });
      setForm(initialForm);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to add plant";
      setLocalError(message);
      onError?.(message);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Add a plant</h2>
      <p className="text-sm text-slate-600">Name, species, and location are required. Status defaults to Healthy.</p>

      <div className="mt-4 flex flex-col gap-3">
        <Input
          label="Name"
          placeholder="Spike"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <Input
          label="Species"
          placeholder="Snake Plant"
          value={form.species}
          onChange={(e) => setForm((prev) => ({ ...prev, species: e.target.value }))}
        />
        <Input
          label="Location"
          placeholder="Living Room"
          value={form.location}
          onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
        />
        <button
          onClick={handleSubmit}
          disabled={busy}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy ? "Saving…" : "Create plant"}
        </button>
        {localError && <span className="text-xs text-amber-700">{localError}</span>}
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">API usage</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>GET /api/plants (supports ?location=)</li>
          <li>POST /api/plants (name, species, location)</li>
          <li>PATCH /api/plants/[id] (status or lastWatered)</li>
          <li>DELETE /api/plants/[id]</li>
        </ul>
      </div>
    </div>
  );
}
