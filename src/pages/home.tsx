// the today screen. this is where the day actually happens: a focus timer on
// one side, today's tasks on the other, and a thin progress strip up top so
// you can feel the day filling in. it's the heart of the app, so it carries
// the most logic.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Timer from "../components/timer";
import Detail from "../components/detail";
import { usestats } from "../hooks/useStats";
import {
  tasksfor,
  today,
  nicedate,
  gettask,
  logsession,
  getsettings,
  savesettings,
} from "../lib/queries";
import { settings, defaultsettings } from "../lib/types";

export default function Home() {
  const day = today();

  // re-read trigger after any storage write
  const [v, setv] = useState(0);
  const refresh = () => setv((n) => n + 1);

  const tasks = useMemo(() => tasksfor(day), [day, v]);
  const stats = usestats(day);

  // which task the timer is pointed at
  const [activeid, setactiveid] = useState<string | null>(null);
  // settings live in state so the timer reacts to slider changes
  const [cfg, setcfg] = useState<settings>(getsettings());
  const [showcfg, setshowcfg] = useState(false);

  const active = activeid ? gettask(activeid) : undefined;
  const open = tasks.filter((t) => !t.done);

  // auto-pick the first unfinished task when nothing is chosen yet.
  // dread ones are sorted first so that's usually what you land on.
  useEffect(() => {
    if (!activeid && open.length > 0) setactiveid(open[0].id);
    // if the active task got finished or deleted, move on
    if (activeid && !open.find((t) => t.id === activeid)) {
      setactiveid(open[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  // a focus block finished: log it against the active task, then refresh
  function blockdone(minutes: number) {
    if (!activeid) return;
    logsession(activeid, minutes);
    refresh();
  }

  function patchcfg(part: Partial<settings>) {
    const next = { ...cfg, ...part };
    setcfg(next);
    savesettings(next);
  }

  return (
    <div className="today">
      <div className="today-head">
        <div>
          <h1>Today</h1>
          <p className="sub">{nicedate(day)}</p>
        </div>
        <button className="linkbtn" onClick={() => setshowcfg((s) => !s)}>
          {showcfg ? "close timer settings" : "timer settings"}
        </button>
      </div>

      {/* thin strip that fills as you check things off */}
      <div className="strip">
        <div className="strip-bar">
          <div className="strip-fill" style={{ width: `${stats.percent}%` }} />
        </div>
        <span className="strip-label">
          {stats.done}/{stats.total} done · {stats.focusblocks} focus blocks ·{" "}
          {stats.focusminutes} min
        </span>
      </div>

      {showcfg && (
        <div className="cfg">
          <label>
            focus
            <input
              type="number"
              min={5}
              max={60}
              value={cfg.focusmin}
              onChange={(e) => patchcfg({ focusmin: Number(e.target.value) })}
            />
            min
          </label>
          <label>
            short break
            <input
              type="number"
              min={1}
              max={30}
              value={cfg.breakmin}
              onChange={(e) => patchcfg({ breakmin: Number(e.target.value) })}
            />
            min
          </label>
          <label>
            long break
            <input
              type="number"
              min={5}
              max={45}
              value={cfg.longbreakmin}
              onChange={(e) =>
                patchcfg({ longbreakmin: Number(e.target.value) })
              }
            />
            min
          </label>
          <button
            className="linkbtn"
            onClick={() => patchcfg(defaultsettings)}
          >
            reset to 25/5/15
          </button>
        </div>
      )}

      <div className="today-grid">
        <section className="focus-col">
          <Timer cfg={cfg} onfocusdone={blockdone} label={active?.title} />
          {active?.dread && (
            <p className="nudge">
              This is one you usually dodge. Just start the block — you can stop
              after if you want. You won't.
            </p>
          )}
        </section>

        <section className="list-col">
          <h2 className="list-h">
            On the list <span className="count">{open.length} left</span>
          </h2>

          {tasks.length === 0 ? (
            <div className="empty">
              <p>No tasks for today.</p>
              <Link to="/plan" className="btn primary">
                Plan it now
              </Link>
            </div>
          ) : (
            <div className="list">
              {tasks.map((t) => (
                <Detail
                  key={t.id}
                  t={t}
                  onchange={refresh}
                  onpick={setactiveid}
                  active={t.id === activeid}
                />
              ))}
            </div>
          )}

          {tasks.length > 0 && open.length === 0 && (
            <div className="cleared">
              <p>Everything's checked off. Look at the day you built.</p>
              <Link to="/progress" className="btn primary">
                See your progress →
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
