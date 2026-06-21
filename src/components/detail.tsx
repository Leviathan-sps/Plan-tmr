// one task row. shows the title, whether it's a dreaded one, the block
// progress, and lets you check it off, pick it for focus, or edit it.

import { useState } from "react";
import { task } from "../lib/types";
import { toggledone, removetask } from "../lib/queries";
import Edit from "./edit";

interface props {
  t: task;
  onchange: () => void; // re-read after any write
  onpick?: (id: string) => void; // set this task as the focus target
  active?: boolean; // is it the one currently in the timer
}

export default function Detail({ t, onchange, onpick, active }: props) {
  const [editing, setediting] = useState(false);

  // small row of dots, filled = blocks done, hollow = still estimated
  const dots = [];
  const max = Math.max(t.estpomos, t.donepomos);
  for (let i = 0; i < max; i++) {
    dots.push(
      <span key={i} className={i < t.donepomos ? "dot full" : "dot"} />
    );
  }

  if (editing) {
    return (
      <Edit
        t={t}
        onsaved={() => {
          setediting(false);
          onchange();
        }}
        oncancel={() => setediting(false)}
      />
    );
  }

  return (
    <div className={`row ${t.done ? "is-done" : ""} ${active ? "is-active" : ""}`}>
      <button
        className={`check ${t.done ? "on" : ""}`}
        aria-label="done"
        onClick={() => {
          toggledone(t.id);
          onchange();
        }}
      >
        {t.done ? "✓" : ""}
      </button>

      <div className="row-main">
        <div className="row-title">
          {t.title}
          {t.dread && <span className="badge dread">putting off</span>}
        </div>
        {t.note && <div className="row-note">{t.note}</div>}
        <div className="row-dots">
          {dots}
          <span className="row-count">
            {t.donepomos}/{t.estpomos} blocks
          </span>
        </div>
      </div>

      <div className="row-acts">
        {onpick && !t.done && (
          <button className="linkbtn" onClick={() => onpick(t.id)}>
            {active ? "focusing" : "focus"}
          </button>
        )}
        <button className="linkbtn" onClick={() => setediting(true)}>
          edit
        </button>
        <button
          className="linkbtn danger"
          onClick={() => {
            removetask(t.id);
            onchange();
          }}
        >
          del
        </button>
      </div>
    </div>
  );
}
