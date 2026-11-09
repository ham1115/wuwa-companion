"use client";

import { useEffect, useState } from "react";
import { ROUTINE } from "@/data/progress";
import { useIdSet, usePersistentState } from "./storage";
import { periodKeys, type ServerId } from "./resetClock";

/**
 * The routine checklist and its resets, shared by the Routine tab and the Now
 * view so both read one set of ticks and agree on what is left.
 *
 * A list only clears when a stamp from an earlier period is found. A stamp
 * that is missing is just written: nothing was ticked under a clock we know
 * about, so there is nothing to clear.
 */
export function useRoutine() {
  const checks = useIdSet("routine");
  const [dayStamp, setDayStamp, dayHydrated] = usePersistentState<string>("routine-day", "");
  const [weekStamp, setWeekStamp, weekHydrated] = usePersistentState<string>("routine-week", "");
  const [server, setServer, serverHydrated] = usePersistentState<ServerId>("routine-server", "local");

  // A tab left open overnight has to notice the reset when it comes back.
  const [visit, setVisit] = useState(0);
  useEffect(() => {
    const bump = () => {
      if (document.visibilityState === "visible") setVisit((n) => n + 1);
    };
    document.addEventListener("visibilitychange", bump);
    return () => document.removeEventListener("visibilitychange", bump);
  }, []);

  const ready = checks.hydrated && dayHydrated && weekHydrated && serverHydrated;

  useEffect(() => {
    if (!ready) return;
    const now = periodKeys(server);
    const dailyIds = new Set(ROUTINE.filter((r) => r.cadence === "daily").map((r) => r.id));
    const weeklyIds = new Set(ROUTINE.filter((r) => r.cadence === "weekly").map((r) => r.id));
    const dayRolled = dayStamp !== "" && dayStamp !== now.day;
    const weekRolled = weekStamp !== "" && weekStamp !== now.week;
    if (dayRolled || weekRolled) {
      checks.set(
        checks.ids.filter(
          (id) => !((dayRolled && dailyIds.has(id)) || (weekRolled && weeklyIds.has(id)))
        )
      );
    }
    if (dayStamp !== now.day) setDayStamp(now.day);
    if (weekStamp !== now.week) setWeekStamp(now.week);
    // checks.set is stable per render of the hook; the stamps are the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, server, dayStamp, weekStamp, visit]);

  const daily = ROUTINE.filter((r) => r.cadence === "daily");
  const weekly = ROUTINE.filter((r) => r.cadence === "weekly");

  return {
    checks,
    daily,
    weekly,
    dailyDone: daily.filter((r) => checks.has(r.id)).length,
    weeklyDone: weekly.filter((r) => checks.has(r.id)).length,
    server,
    setServer,
    ready,
  };
}
