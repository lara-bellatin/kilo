"use client";

import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { formatLongDate } from "@/lib/format";
import { HoyProgressLine } from "@/components/hoy-progress-line";
import type {
  DayLog,
  DayType,
  FreeEntry,
  LogEntry,
  PlanForDay,
} from "../lib/types";

import { shiftIsoDate } from "@/lib/date";
import {
  dayUnits,
  globalStats,
  sectionStats,
} from "../lib/derive";
import {
  createFreeEntryAction,
  deleteFreeEntryAction,
  setDayTypeAction,
  setEntryServingsAction,
  setWaterLitersAction,
  updateFreeEntryAction,
} from "../lib/actions";
import { Eyebrow } from "@/components/eyebrow";
import { DayTypeSelector } from "./day-type-selector";
import { DaySummary } from "./day-summary";
import { SectionCard } from "./section-card";
import { Pill } from "@/components/pill";
import { FreeEntries } from "./free-entries";
import type { FreeEntryDraft } from "./free-entry-form";

type OptimisticDay = {
  dayType: DayType;
  waterLiters: number;
  entries: LogEntry[];
  freeEntries: FreeEntry[];
};

type Patch =
  | { kind: "day-type"; dayType: DayType }
  | { kind: "water"; waterLiters: number }
  | {
      kind: "entry";
      optionId: string;
      occurrence: number;
      servings: number;
    }
  | { kind: "free-add"; entry: FreeEntry }
  | { kind: "free-update"; id: string; patch: Partial<FreeEntry> }
  | { kind: "free-delete"; id: string };

function applyPatch(prev: OptimisticDay, patch: Patch): OptimisticDay {
  if (patch.kind === "day-type") return { ...prev, dayType: patch.dayType };
  if (patch.kind === "water") return { ...prev, waterLiters: patch.waterLiters };
  if (patch.kind === "free-add") {
    return { ...prev, freeEntries: [...prev.freeEntries, patch.entry] };
  }
  if (patch.kind === "free-update") {
    return {
      ...prev,
      freeEntries: prev.freeEntries.map((f) =>
        f.id === patch.id ? { ...f, ...patch.patch } : f,
      ),
    };
  }
  if (patch.kind === "free-delete") {
    return {
      ...prev,
      freeEntries: prev.freeEntries.filter((f) => f.id !== patch.id),
    };
  }
  const others = prev.entries.filter(
    (e) => !(e.optionId === patch.optionId && e.occurrence === patch.occurrence),
  );
  if (patch.servings === 0) return { ...prev, entries: others };
  return {
    ...prev,
    entries: [
      ...others,
      {
        optionId: patch.optionId,
        occurrence: patch.occurrence,
        servings: patch.servings,
      },
    ],
  };
}

export function HoyView({
  plan,
  dayLog,
  isoDate,
  todayIsoDate,
}: {
  plan: PlanForDay;
  dayLog: DayLog;
  isoDate: string;
  todayIsoDate: string;
}) {
  const router = useRouter();
  const isToday = isoDate === todayIsoDate;
  const canGoForward = isoDate < todayIsoDate;

  function goToDate(next: string) {
    const href = next === todayIsoDate ? "/hoy" : `/hoy?date=${next}`;
    router.push(href);
  }

  const initial: OptimisticDay = {
    dayType: dayLog.dayType,
    waterLiters: dayLog.waterLiters,
    entries: dayLog.entries,
    freeEntries: dayLog.freeEntries,
  };

  const [state, applyOptimistic] = useOptimistic(initial, applyPatch);
  const [, startTransition] = useTransition();

  const dateLabel = useMemo(() => {
    const [y, m, d] = isoDate.split("-").map((n) => parseInt(n, 10));
    return formatLongDate(new Date(y, m - 1, d));
  }, [isoDate]);

  const units = useMemo(
    () => dayUnits(plan.sections, state.dayType),
    [plan.sections, state.dayType],
  );

  const [userExpanded, setUserExpanded] = useState<Record<string, boolean>>({});
  const firstInstanceId = units[0]?.instanceId;
  const expanded = useMemo<Record<string, boolean>>(() => {
    if (!firstInstanceId) return userExpanded;
    if (userExpanded[firstInstanceId] !== undefined) return userExpanded;
    return { ...userExpanded, [firstInstanceId]: true };
  }, [userExpanded, firstInstanceId]);

  const stats = units.map((u) => sectionStats(u.section, state.entries, u.occurrence));
  const global = globalStats(units, state.entries);
  const pct = global.picks > 0 ? (global.marked / global.picks) * 100 : 0;

  const boundaries: number[] = [];
  if (global.picks > 0) {
    let acc = 0;
    for (let i = 0; i < stats.length - 1; i++) {
      acc += stats[i].picks;
      boundaries.push((acc / global.picks) * 100);
    }
  }

  function pickDayType(next: DayType) {
    startTransition(async () => {
      applyOptimistic({ kind: "day-type", dayType: next });
      await setDayTypeAction(isoDate, next);
    });
  }

  function addWater(deltaMl: number) {
    const next = Math.round((state.waterLiters + deltaMl / 1000) * 1000) / 1000;
    startTransition(async () => {
      applyOptimistic({ kind: "water", waterLiters: next });
      await setWaterLitersAction(isoDate, next);
    });
  }

  function changeCount(
    _sectionId: string,
    occurrence: number,
    optionId: string,
    next: number,
  ) {
    startTransition(async () => {
      applyOptimistic({
        kind: "entry",
        optionId,
        occurrence,
        servings: next,
      });
      await setEntryServingsAction({
        date: isoDate,
        optionId,
        occurrence,
        servings: next,
        dayType: state.dayType,
      });
    });
  }

  function createFreeEntry(sectionId: string | null, draft: FreeEntryDraft) {
    const tempId = `optimistic-${crypto.randomUUID()}`;
    startTransition(async () => {
      applyOptimistic({
        kind: "free-add",
        entry: { id: tempId, sectionId, ...draft },
      });
      await createFreeEntryAction({
        date: isoDate,
        dayType: state.dayType,
        sectionId,
        ...draft,
      });
    });
  }

  function updateFreeEntry(id: string, draft: FreeEntryDraft) {
    startTransition(async () => {
      applyOptimistic({ kind: "free-update", id, patch: draft });
      await updateFreeEntryAction(id, {
        sectionId:
          state.freeEntries.find((f) => f.id === id)?.sectionId ?? null,
        ...draft,
      });
    });
  }

  function deleteFreeEntry(id: string) {
    startTransition(async () => {
      applyOptimistic({ kind: "free-delete", id });
      await deleteFreeEntryAction(id);
    });
  }

  const unassignedFreeEntries = state.freeEntries.filter(
    (f) => f.sectionId === null,
  );

  return (
    <div className="hoy-shell hoy-celebrate">
      <HoyProgressLine pct={pct} />

      <div className="hoy-titlerow">
        <div>
          <Eyebrow>{dateLabel || "\u00a0"}</Eyebrow>
          <h1 className="text-h1">{isToday ? "Hoy" : "Diario"}</h1>
        </div>
        <div className="hoy-datenav">
          <IconButton
            aria-label="Día anterior"
            onClick={() => goToDate(shiftIsoDate(isoDate, -1))}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </IconButton>
          <IconButton
            aria-label="Día siguiente"
            onClick={() => goToDate(shiftIsoDate(isoDate, 1))}
            disabled={!canGoForward}
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </IconButton>
        </div>
      </div>

      <DayTypeSelector
        plan={plan}
        active={state.dayType}
        onChange={pickDayType}
      />

      <DaySummary
        plan={plan}
        dayType={state.dayType}
        choicesMarked={global.marked}
        choicesTotal={global.picks}
        sectionBoundaries={boundaries}
        waterLiters={state.waterLiters}
        onWater={addWater}
      />

      {units.map((u) => {
        const totalOccurrences = units.filter(
          (o) => o.section.id === u.section.id,
        ).length;
        const extra =
          u.section.sectionType === "comida" &&
          plan.targets[state.dayType].kcalAdjustment > 0 &&
          u.section.visibleWhen?.length ? (
            <Pill tone="accent">
              +{plan.targets[state.dayType].kcalAdjustment} kcal
            </Pill>
          ) : null;
        const sectionFree = state.freeEntries.filter(
          (f) => f.sectionId === u.section.id,
        );
        return (
          <SectionCard
            key={u.key}
            section={u.section}
            occurrence={u.occurrence}
            totalOccurrences={totalOccurrences}
            entries={state.entries}
            freeEntries={sectionFree}
            expanded={!!expanded[u.instanceId]}
            onToggleExpand={() =>
              setUserExpanded((prev) => ({
                ...prev,
                [u.instanceId]: !(prev[u.instanceId] ?? expanded[u.instanceId]),
              }))
            }
            onChangeCount={changeCount}
            onCreateFreeEntry={createFreeEntry}
            onUpdateFreeEntry={updateFreeEntry}
            onDeleteFreeEntry={deleteFreeEntry}
            extraBadge={extra}
          />
        );
      })}

      <section className="hoy-section hoy-section--free">
        <div className="hoy-sec-head" aria-hidden>
          <span className="hoy-sec-icon" aria-hidden>
            <Pencil size={18} strokeWidth={1.5} />
          </span>
          <div className="hoy-sec-titles">
            <h2>Fuera del plan</h2>
            <div className="hoy-sec-sub">
              <span>antojos y comidas sueltas del día</span>
            </div>
          </div>
        </div>
        <div className="hoy-sec-body">
          <FreeEntries
            entries={unassignedFreeEntries}
            onCreate={(draft) => createFreeEntry(null, draft)}
            onUpdate={updateFreeEntry}
            onDelete={deleteFreeEntry}
            addLabel="Agregar"
          />
        </div>
      </section>
    </div>
  );
}
