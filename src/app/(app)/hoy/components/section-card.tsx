"use client";

import { ChevronDown, Info, Check } from "lucide-react";
import { SectionIcon } from "@/components/section-icon";
import type { FreeEntry, LogEntry, PlanSection } from "../lib/types";
import {
  groupTotal,
  sectionStats,
  stateForGroup,
} from "../lib/derive";
import { usePop } from "../lib/motion";
import { Pill } from "./pill";
import { OptionGroup } from "./option-group";
import { FreeEntries } from "./free-entries";
import type { FreeEntryDraft } from "./free-entry-form";

function dotClass(state: ReturnType<typeof stateForGroup>) {
  if (state === "done") return "hoy-dot done";
  if (state === "over") return "hoy-dot over";
  if (state === "partial") return "hoy-dot partial";
  return "hoy-dot";
}

const ORDINAL: Record<number, string> = {
  1: "1ª",
  2: "2ª",
  3: "3ª",
};

export function SectionCard({
  section,
  occurrence,
  totalOccurrences,
  entries,
  freeEntries,
  expanded,
  onToggleExpand,
  onChangeCount,
  onCreateFreeEntry,
  onUpdateFreeEntry,
  onDeleteFreeEntry,
  extraBadge,
}: {
  section: PlanSection;
  occurrence: number;
  totalOccurrences: number;
  entries: LogEntry[];
  freeEntries: FreeEntry[];
  expanded: boolean;
  onToggleExpand: () => void;
  onChangeCount: (
    sectionId: string,
    occurrence: number,
    optionId: string,
    next: number,
  ) => void;
  onCreateFreeEntry: (sectionId: string, draft: FreeEntryDraft) => void;
  onUpdateFreeEntry: (id: string, draft: FreeEntryDraft) => void;
  onDeleteFreeEntry: (id: string) => void;
  extraBadge?: React.ReactNode;
}) {
  const stats = sectionStats(section, entries, occurrence);
  const done = stats.done;
  const pop = usePop(done);
  const repeated = totalOccurrences > 1;
  const hasFreeEntries = freeEntries.length > 0;
  const showFreeInstead = occurrence === 1 && hasFreeEntries && stats.marked === 0;

  return (
    <section className={"hoy-section" + (expanded ? "" : " collapsed")}>
      <button
        type="button"
        className="hoy-sec-head"
        aria-expanded={expanded}
        onClick={onToggleExpand}
      >
        <span
          className={
            "hoy-sec-icon" +
            (done ? " is-done" : "") +
            (pop ? " hoy-pop" : "")
          }
          aria-hidden
        >
          {done ? (
            <Check size={18} strokeWidth={1.5} />
          ) : (
            <SectionIcon name={section.icon} />
          )}
        </span>
        <div className="hoy-sec-titles">
          <h2>{section.label}</h2>
          {repeated ? (
            <div className="hoy-sec-sub">
              <span>
                {ORDINAL[occurrence] ?? `${occurrence}ª`} de {totalOccurrences}
              </span>
            </div>
          ) : null}
        </div>
        <div className="hoy-sec-meta">
          {extraBadge}
          {done ? (
            <Pill tone="done" icon="check" className={pop ? "hoy-pop" : undefined}>
              completa
            </Pill>
          ) : showFreeInstead ? (
            <span className="hoy-sec-freehint">fuera del plan</span>
          ) : (
            <>
              <span className="hoy-dots" aria-hidden>
                {section.groups.map((g) => {
                  const st = stateForGroup(g, entries, occurrence);
                  return (
                    <span key={g.id} className={dotClass(st)} />
                  );
                })}
              </span>
              <span className="hoy-sec-count">
                {stats.groupsDone}/{stats.groups}
              </span>
            </>
          )}
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className="hoy-chev"
            aria-hidden
          />
        </div>
      </button>

      <div className={"hoy-collapse" + (expanded ? " open" : "")}>
        <div className="hoy-collapse-inner">
          <div className="hoy-sec-body">
            {section.notes ? (
              <p className="hoy-note">
                <Info size={14} strokeWidth={1.5} aria-hidden />
                <span>{section.notes}</span>
              </p>
            ) : null}
            {section.groups.map((g) => (
              <OptionGroup
                key={g.id}
                group={g}
                entries={entries}
                occurrence={occurrence}
                onChangeCount={(optionId, next) =>
                  onChangeCount(section.id, occurrence, optionId, next)
                }
              />
            ))}
            {occurrence === 1 ? (
              <FreeEntries
                entries={freeEntries}
                onCreate={(draft) => onCreateFreeEntry(section.id, draft)}
                onUpdate={onUpdateFreeEntry}
                onDelete={onDeleteFreeEntry}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={
          "hoy-collapse" +
          (!expanded && !done ? " open" : "")
        }
      >
        <div className="hoy-collapse-inner">
          <div className="hoy-sec-chips">
            {section.groups.map((g) => {
              const st = stateForGroup(g, entries, occurrence);
              const total = groupTotal(g, entries, occurrence);
              const tone =
                st === "done" ? "done" : st === "over" ? "warn" : "neutral";
              const icon =
                st === "done" ? "check" : st === "over" ? "triangle-alert" : undefined;
              return (
                <Pill key={g.id} tone={tone} icon={icon}>
                  {g.label.toLowerCase()} {total}/{g.pickCount}
                </Pill>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

