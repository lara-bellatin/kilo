"use client";

import { useCountUp, usePop } from "../lib/motion";
import { formatKcal, formatLiters } from "@/lib/format";
import { DAY_TYPE_LABEL, type DayType, type PlanForDay } from "../lib/types";
import { Eyebrow } from "./eyebrow";
import { Pill } from "./pill";
import { ProgressBar } from "./progress-bar";

type Props = {
  plan: PlanForDay;
  dayType: DayType;
  choicesMarked: number;
  choicesTotal: number;
  sectionBoundaries: number[]; // % positions for notches (excluding 0% and 100%)
  waterLiters: number;
  onWater: (deltaMl: number) => void;
};

export function DaySummary({
  plan,
  dayType,
  choicesMarked,
  choicesTotal,
  sectionBoundaries,
  waterLiters,
  onWater,
}: Props) {
  const target = plan.targets[dayType];
  const kcal = useCountUp(target.kcalTotal);
  const delta = target.kcalAdjustment;

  const choicesDone = choicesTotal > 0 && choicesMarked >= choicesTotal;
  const popDay = usePop(choicesDone);

  const waterTarget = target.waterLiters;
  const waterDone = waterTarget > 0 && waterLiters >= waterTarget;
  const popWater = usePop(waterDone);
  const waterPct = waterTarget > 0 ? (waterLiters / waterTarget) * 100 : 0;

  const waterNotches: number[] = [];
  const waterInt = Math.ceil(waterTarget);
  for (let i = 1; i < waterInt; i++) {
    waterNotches.push((i / waterTarget) * 100);
  }

  const choicesPct =
    choicesTotal > 0 ? (choicesMarked / choicesTotal) * 100 : 0;

  return (
    <section className="hoy-instrument" aria-label="Resumen del día">
      <div className="hoy-inst-row">
        <div className="hoy-inst-head">
          <Eyebrow>Objetivo</Eyebrow>
          {delta > 0 ? (
            <Pill tone="accent">
              {DAY_TYPE_LABEL[dayType].toLowerCase()} · +{delta} kcal
            </Pill>
          ) : null}
        </div>
        <div className="hoy-obj-num">
          {formatKcal(kcal)}
          <span className="unit">kcal</span>
        </div>
      </div>

      <div className="hoy-inst-row">
        <div className="hoy-inst-head">
          <Eyebrow>Elecciones</Eyebrow>
          <span className="right">
            {choicesDone ? (
              <Pill tone="done" icon="check" className={popDay ? "hoy-pop" : undefined}>
                día completo
              </Pill>
            ) : null}
            <span className={"hoy-inst-count" + (choicesDone ? " is-done" : "")}>
              {choicesMarked}
              <span className="of">/{choicesTotal}</span>
            </span>
          </span>
        </div>
        <ProgressBar pct={choicesPct} notches={sectionBoundaries} />
      </div>

      <div className="hoy-inst-row">
        <div className="hoy-inst-head">
          <Eyebrow>Agua</Eyebrow>
          <span className="right">
            {waterDone ? (
              <Pill tone="done" icon="check" className={popWater ? "hoy-pop" : undefined}>
                completa
              </Pill>
            ) : null}
            <span className="hoy-inst-count agua">
              {formatLiters(waterLiters)}
              <span className="of"> / {formatLiters(waterTarget)} L</span>
            </span>
          </span>
        </div>
        <ProgressBar water pct={waterPct} notches={waterNotches} />
        <div className="hoy-water-btns">
          <button type="button" onClick={() => onWater(250)}>+250 ml</button>
          <button type="button" onClick={() => onWater(500)}>+500 ml</button>
          <button type="button" onClick={() => onWater(1000)}>+1 L</button>
        </div>
      </div>
    </section>
  );
}
