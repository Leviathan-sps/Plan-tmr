// the end-of-day look back. one big number for today, the dread tasks you
// beat, and a small seven day strip so a good run is visible.

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usestats } from "../hooks/useStats";
import { today, daykey, tasksfor, nicedate } from "../lib/queries";

// completion percent for a given day, used by the little history bars
function percentfor(day: string): number {
  const t = tasksfor(day);
  if (t.length === 0) return 0;
  return Math.round((t.filter((x) => x.done).length / t.length) * 100);
}

// a short line that changes with how the day went
function verdict(percent: number, dreaddone: number): string {
  if (percent === 100) return "Clean sweep. That's a rare day, enjoy it.";
  if (dreaddone > 0) return "You faced the thing you avoid. That's the whole game.";
  if (percent >= 50) return "Solid. Half a list beaten is still a win.";
  if (percent > 0) return "A start counts. Tomorrow you build on it.";
  return "Quiet day. Plan tomorrow and try again, no guilt.";
}

export default function Progress() {
  const day = today();
  const stats = usestats(day);
  const tasks = useMemo(() => tasksfor(day), [day]);

  // last seven days, oldest first
  const week = useMemo(() => {
    const out: { key: string; pct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = daykey(d);
      out.push({ key, pct: percentfor(key) });
    }
    return out;
  }, []);

  const done = tasks.filter((t) => t.done);
  const left = tasks.filter((t) => !t.done);

  return (
    <div className="progress">
      <h1>How today went</h1>
      <p className="sub">{nicedate(day)}</p>

      <div className="prog-grid">
        <div className="ring-card">
          {/* plain conic ring, no library */}
          <div
            className="ring"
            style={{
              background: `conic-gradient(#e84d3d ${stats.percent * 3.6}deg, #eee 0deg)`,
            }}
          >
            <div className="ring-hole">
              <span className="ring-num">{stats.percent}%</span>
              <span className="ring-sub">done</span>
            </div>
          </div>
          <p className="verdict">{verdict(stats.percent, stats.dreaddone)}</p>
        </div>

        <div className="stat-cards">
          <div className="statcard">
            <span className="big">
              {stats.done}/{stats.total}
            </span>
            <span className="lbl">tasks finished</span>
          </div>
          <div className="statcard">
            <span className="big">
              {stats.dreaddone}/{stats.dreadtotal}
            </span>
            <span className="lbl">dreaded ones beaten</span>
          </div>
          <div className="statcard">
            <span className="big">{stats.focusblocks}</span>
            <span className="lbl">focus blocks</span>
          </div>
          <div className="statcard">
            <span className="big">{stats.focusminutes}</span>
            <span className="lbl">minutes focused</span>
          </div>
        </div>
      </div>

      <section className="week">
        <h2>This week</h2>
        <div className="week-bars">
          {week.map((d) => (
            <div className="weekday" key={d.key}>
              <div className="weekbar">
                <div className="weekbar-fill" style={{ height: `${d.pct}%` }} />
              </div>
              <span className="weekday-lbl">{d.key.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      {done.length > 0 && (
        <section className="recap">
          <h2>Finished</h2>
          <ul className="recap-list">
            {done.map((t) => (
              <li key={t.id} className="recap-done">
                <span className="tick">✓</span> {t.title}
                {t.dread && <span className="badge dread">faced it</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {left.length > 0 && (
        <section className="recap">
          <h2>Still open</h2>
          <ul className="recap-list">
            {left.map((t) => (
              <li key={t.id} className="recap-left">
                {t.title}
              </li>
            ))}
          </ul>
          <Link to="/plan" className="btn ghost">
            Carry these into tomorrow
          </Link>
        </section>
      )}

      <div className="prog-foot">
        <Link to="/plan" className="btn primary">
          Plan tomorrow →
        </Link>
      </div>
    </div>
  );
}
