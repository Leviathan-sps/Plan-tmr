// the pomodoro clock. counts down a focus block, then a break, and tells the
// parent every time a focus block finishes so it can log progress.

import { useEffect, useRef, useState } from "react";
import { settings } from "../lib/types";

type phase = "focus" | "break" | "long";

interface props {
  cfg: settings;
  // fired once per finished focus block, minutes is the block length
  onfocusdone: (minutes: number) => void;
  // label of the task being worked, shown under the clock
  label?: string;
}

// mm:ss from a second count
function clockface(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timer({ cfg, onfocusdone, label }: props) {
  const [phase, setphase] = useState<phase>("focus");
  const [left, setleft] = useState(cfg.focusmin * 60);
  const [running, setrunning] = useState(false);
  const [round, setround] = useState(0); // finished focus blocks this sitting
  const tick = useRef<number | null>(null);

  // length in seconds for a given phase
  function lenof(p: phase): number {
    if (p === "focus") return cfg.focusmin * 60;
    if (p === "break") return cfg.breakmin * 60;
    return cfg.longbreakmin * 60;
  }

  // if the user changes the durations while idle, reflect it right away
  useEffect(() => {
    if (!running) setleft(lenof(phase));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.focusmin, cfg.breakmin, cfg.longbreakmin]);

  // the actual countdown
  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setleft((s) => s - 1);
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [running]);

  // when we hit zero, switch phase and maybe log a finished block
  useEffect(() => {
    if (left > 0) return;
    setrunning(false);

    if (phase === "focus") {
      onfocusdone(cfg.focusmin);
      const next = round + 1;
      setround(next);
      // every fourth block earns the longer break
      const nextphase: phase = next % 4 === 0 ? "long" : "break";
      ding();
      setphase(nextphase);
      setleft(lenof(nextphase));
    } else {
      ding();
      setphase("focus");
      setleft(lenof("focus"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  // tiny beep so you notice without staring at the tab
  function ding() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 660;
      gain.gain.value = 0.05;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // audio blocked, no big deal
    }
  }

  function reset() {
    setrunning(false);
    setleft(lenof(phase));
  }

  function skip() {
    setleft(0);
  }

  const total = lenof(phase);
  const pct = total ? ((total - left) / total) * 100 : 0;
  const phasetext =
    phase === "focus" ? "Focus" : phase === "break" ? "Short break" : "Long break";

  return (
    <div className={`timer ${phase}`}>
      <div className="timer-phase">{phasetext}</div>

      <div className="dial">
        <div className="dial-fill" style={{ height: `${pct}%` }} />
        <div className="dial-time">{clockface(left)}</div>
      </div>

      {label && <div className="timer-label">on: {label}</div>}

      <div className="timer-btns">
        <button className="btn primary" onClick={() => setrunning((r) => !r)}>
          {running ? "Pause" : "Start"}
        </button>
        <button className="btn ghost" onClick={reset}>
          Reset
        </button>
        <button className="btn ghost" onClick={skip}>
          Skip
        </button>
      </div>

      <div className="timer-round">blocks done this sitting: {round}</div>
    </div>
  );
}
