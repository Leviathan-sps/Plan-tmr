// all the read/write logic the screens call. db.ts handles the raw storage,
// this file knows what a task and a session actually mean.

import { read, write, newid } from "./db";
import {
  task,
  session,
  settings,
  defaultsettings,
  taskid,
} from "./types";

const taskskey = "tasks";
const sessionskey = "sessions";
const settingskey = "settings";

// ---- date helpers ----

// turn a date into yyyy-mm-dd in the user's own timezone, not utc
export function daykey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function today(): string {
  return daykey(new Date());
}

export function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return daykey(d);
}

// friendly label like "Mon, Jun 24" for headers
export function nicedate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ---- tasks ----

export function alltasks(): task[] {
  return read<task[]>(taskskey, []);
}

// tasks planned for one specific day, dread ones float to the top
export function tasksfor(day: string): task[] {
  // const mine = alltasks().filter((t) => t.planfor === day);  // old way, then added the sort
  return alltasks()
    .filter((t) => t.planfor === day)
    .sort((a, b) => {
      if (a.dread !== b.dread) return a.dread ? -1 : 1;
      return a.createdat - b.createdat;
      // return b.createdat - a.createdat;  // had it newest first first, looked weird
    });
}

export function gettask(id: taskid): task | undefined {
  return alltasks().find((t) => t.id === id);
}

// make a fresh task for a given day, returns the saved row
export function addtask(input: {
  title: string;
  note?: string;
  dread?: boolean;
  estpomos?: number;
  planfor: string;
}): task {
  const t: task = {
    id: newid(),
    title: input.title.trim(),
    note: (input.note ?? "").trim(),
    dread: input.dread ?? false,
    estpomos: Math.max(1, input.estpomos ?? 1),
    donepomos: 0,
    done: false,
    planfor: input.planfor,
    createdat: Date.now(),
  };
  const list = alltasks();
  list.push(t);
  write(taskskey, list);
  // console.log("added task", t);  // todo remove, was debuging the dread flag
  return t;
}

// patch a task by id, ignore if it's gone
export function updatetask(id: taskid, patch: Partial<task>): void {
  const list = alltasks();
  const i = list.findIndex((t) => t.id === id);
  if (i === -1) return;
  list[i] = { ...list[i], ...patch };
  write(taskskey, list);
}

export function removetask(id: taskid): void {
  write(
    taskskey,
    alltasks().filter((t) => t.id !== id)
  );
}

// flip the done flag, used by the checkbox on each row
export function toggledone(id: taskid): void {
  const t = gettask(id);
  if (!t) return;
  updatetask(id, { done: !t.done });
}

// move anything left unfinished from a day onto the next day.
// handy at night when you carry yesterday's leftovers forward.
export function carryover(fromday: string, today: string): number {
  const left = tasksfor(fromday).filter((t) => !t.done);
  for (const t of left) updatetask(t.id, { planfor: today });
  return left.length;
}

// ---- sessions ----

export function allsessions(): session[] {
  return read<session[]>(sessionskey, []);
}

// record one finished focus block and bump the task's count
export function logsession(taskid: taskid, minutes: number): void {
  const s: session = {
    id: newid(),
    taskid,
    date: today(),
    minutes,
    at: Date.now(),
  };
  const list = allsessions();
  list.push(s);
  write(sessionskey, list);

  const t = gettask(taskid);
  if (t) updatetask(taskid, { donepomos: t.donepomos + 1 });
}

export function sessionsfor(day: string): session[] {
  return allsessions().filter((s) => s.date === day);
}

// ---- settings ----

export function getsettings(): settings {
  return read<settings>(settingskey, defaultsettings);
}

export function savesettings(s: settings): void {
  write(settingskey, s);
}
