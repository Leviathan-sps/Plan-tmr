// crunches one day into the numbers the progress screen shows.

import { useMemo } from "react";
import { tasksfor, sessionsfor } from "../lib/queries";

export interface daystats {
  total: number;
  done: number;
  percent: number; // 0..100, rounded
  dreadtotal: number;
  dreaddone: number;
  focusblocks: number;
  focusminutes: number;
}

// pass a day key (yyyy-mm-dd) and get its summary. recomputes when the key changes.
export function usestats(day: string): daystats {
  return useMemo(() => {
    const tasks = tasksfor(day);
    const sessions = sessionsfor(day);

    const done = tasks.filter((t) => t.done).length;
    const dread = tasks.filter((t) => t.dread);
    const minutes = sessions.reduce((sum, s) => sum + s.minutes, 0);

    return {
      total: tasks.length,
      done,
      percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
      dreadtotal: dread.length,
      dreaddone: dread.filter((t) => t.done).length,
      focusblocks: sessions.length,
      focusminutes: minutes,
    };
  }, [day]);
}
