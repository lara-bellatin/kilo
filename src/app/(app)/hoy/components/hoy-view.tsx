"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { formatLongDate } from "@/lib/format";
import { HoyProgressLine } from "@/components/hoy-progress-line";
import type { DayLog, DayType, LogEntry, PlanForDay } from "../lib/types";

import {
  dayUnits,
  globalStats,
  sectionStats,
} from "../lib/derive";
import {
  setDayTypeAction,
  setEntryServingsAction,
  setWaterLitersAction,
} from "../lib/actions";
import { Eyebrow } from "./eyebrow";
import { DayTypeSelector } from "./day-type-selector";
import { DaySummary } from "./day-summary";
import { SectionCard } from "./section-card";
import { Pill } from "./pill";

type OptimisticDay = {
  dayType: DayType;
  waterLiters: number;
  entries: LogEntry[];
};

type Patch =
  | { kind: "day-type"; dayType: DayType }
  | { kind: "water"; waterLiters: number }
  | {
      kind: "entry";
      optionId: string;
      occurrence: number;
      servings: number;
    };

function applyPatch(prev: OptimisticDay, patch: Patch): OptimisticDay {
  if (patch.kind === "day-type") return { ...prev, dayType: patch.dayType };
  if (patch.kind === "water") return { ...prev, waterLiters: patch.waterLiters };
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
}: {
  plan: PlanForDay;
  dayLog: DayLog;
  isoDate: string;
}) {
  const initial: OptimisticDay = {
    dayType: dayLog.dayType,
    waterLiters: dayLog.waterLiters,
    entries: dayLog.entries,
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

  return (
    <div className="hoy-shell hoy-celebrate">
      <HoyProgressLine pct={pct} />

      <div className="hoy-titlerow">
        <div>
          <Eyebrow>{dateLabel || "\u00a0"}</Eyebrow>
          <h1 className="text-h1">Hoy</h1>
        </div>
        <div className="hoy-datenav">
          <IconButton aria-label="Día anterior" disabled>
            <ChevronLeft size={20} strokeWidth={1.5} />
          </IconButton>
          <IconButton aria-label="Día siguiente" disabled>
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
        return (
          <SectionCard
            key={u.key}
            section={u.section}
            occurrence={u.occurrence}
            totalOccurrences={totalOccurrences}
            entries={state.entries}
            expanded={!!expanded[u.instanceId]}
            onToggleExpand={() =>
              setUserExpanded((prev) => ({
                ...prev,
                [u.instanceId]: !(prev[u.instanceId] ?? expanded[u.instanceId]),
              }))
            }
            onChangeCount={changeCount}
            extraBadge={extra}
          />
        );
      })}
    </div>
  );
}
