// the planning screen. defaults to tomorrow because that's the whole pitch,
// but you can flip to today if you're setting up on the fly.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Add from "../components/add";
import Detail from "../components/detail";
import {
  tasksfor,
  tomorrow,
  today,
  nicedate,
  carryover,
} from "../lib/queries";

export default function Plan() {
  const [day, setday] = useState(tomorrow());
  // bumping this re-reads from storage after any write
  const [v, setv] = useState(0);
  const refresh = () => setv((n) => n + 1);

  const tasks = useMemo(() => tasksfor(day), [day, v]);

  const dread = tasks.filter((t) => t.dread).length;
  const blocks = tasks.reduce((sum, t) => sum + t.estpomos, 0);
  const istomorrow = day === tomorrow();

  // pull anything left unfinished from today onto the day we're planning
  function pullleftovers() {
    const moved = carryover(today(), day);
    if (moved === 0) {
      alert("nothing left over from today, you're clear");
    }
    refresh();
  }

  return (
    <div className="plan">
      <div className="plan-head">
        <div>
          <h1>Plan {istomorrow ? "tomorrow" : "today"}</h1>
          <p className="sub">{nicedate(day)}</p>
        </div>
        <div className="daypick">
          <button
            className={`pill ${istomorrow ? "on" : ""}`}
            onClick={() => setday(tomorrow())}
          >
            Tomorrow
          </button>
          <button
            className={`pill ${day === today() ? "on" : ""}`}
            onClick={() => setday(today())}
          >
            Today
          </button>
        </div>
      </div>

      <Add day={day} onadded={refresh} />

      {tasks.length === 0 ? (
        <div className="empty">
          <p>Nothing here yet.</p>
          <p className="sub">
            Add the two or three things that actually matter. Be honest about
            the one you've been avoiding.
          </p>
        </div>
      ) : (
        <>
          <div className="plan-summary">
            <span>
              {tasks.length} task{tasks.length === 1 ? "" : "s"}
            </span>
            <span>·</span>
            <span>{blocks} focus blocks planned</span>
            {dread > 0 && (
              <>
                <span>·</span>
                <span className="hl">{dread} you keep putting off</span>
              </>
            )}
          </div>

          <div className="list">
            {tasks.map((t) => (
              <Detail key={t.id} t={t} onchange={refresh} />
            ))}
          </div>
        </>
      )}

      <div className="plan-foot">
        <button className="btn ghost" onClick={pullleftovers}>
          Carry over today's leftovers
        </button>
        <Link to="/today" className="btn primary">
          Go to today →
        </Link>
      </div>
    </div>
  );
}
