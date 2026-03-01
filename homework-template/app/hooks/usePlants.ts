"use client";

import { useEffect, useMemo, useState } from "react";
import type { Plant, PlantStatus } from "@/types";

export type CreatePlantInput = Pick<Plant, "name" | "species" | "location">;

const normalizePlants = (payload: unknown): Plant[] => {
  const toPlant = (raw: any): Plant => ({
    ...raw,
    lastWatered: raw?.lastWatered ? new Date(raw.lastWatered) : new Date(),
  });

  if (Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: Plant[] }).data.map(toPlant);
  }

  if (Array.isArray(payload)) {
    return (payload as Plant[]).map(toPlant);
  }

  if (payload && typeof payload === "object" && Array.isArray((payload as { plants?: unknown }).plants)) {
    return (payload as { plants: Plant[] }).plants.map(toPlant);
  }

  return [];
};

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState("*");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadPlants = async (location?: string) => {
    setLoading(true);
    setError(null);
    try {
      const query = location && location !== "*" ? `?location=${encodeURIComponent(location)}` : "";
      const res = await fetch(`/api/plants${query}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Unable to fetch plants (${res.status})`);
      }
      const payload = await res.json();
      setPlants(normalizePlants(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants(locationFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationFilter]);

  const createPlant = async (input: CreatePlantInput) => {
    setError(null);
    setBusyId("new");
    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.name.trim(),
          species: input.species.trim(),
          location: input.location.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Unable to add plant");
      }

      await loadPlants(locationFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add plant");
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  const updatePlant = async (
    id: string,
    updates: Partial<Pick<Plant, "status" | "lastWatered">>
  ) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/plants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Unable to update ${id}`);
      }

      await loadPlants(locationFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update plant");
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  const deletePlant = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/plants/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Unable to delete ${id}`);
      }
      await loadPlants(locationFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete plant");
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  const summary = useMemo(() => {
    const total = plants.length;
    const healthy = plants.filter((p) => p.status === "Healthy").length;
    const thirsty = plants.filter((p) => p.status === "Thirsty").length;
    return { total, healthy, thirsty };
  }, [plants]);

  return {
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
    reload: () => loadPlants(locationFilter),
  };
}
