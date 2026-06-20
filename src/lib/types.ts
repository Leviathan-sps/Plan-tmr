// shared shapes. kept small on purpose, everything else imports from here.

export type taskid = string;

// a single thing you want to get done
export interface task {
  id: taskid;
  title: string;
  note: string;
  dread: boolean; // the ones you keep putting off
  estpomos: number; // how many focus blocks you guessed
  donepomos: number; // how many you actually finished
  done: boolean;
  planfor: string; // yyyy-mm-dd, the day it belongs to
  createdat: number;
}

// one finished focus block, used for the end of day numbers
export interface session {
  id: string;
  taskid: taskid;
  date: string; // yyyy-mm-dd
  minutes: number;
  at: number;
}

// timer lengths, tweakable from the focus screen
export interface settings {
  focusmin: number;
  breakmin: number;
  longbreakmin: number;
}

export const defaultsettings: settings = {
  focusmin: 25,
  breakmin: 5,
  longbreakmin: 15,
};
