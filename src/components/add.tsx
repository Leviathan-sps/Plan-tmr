// the little form for adding a task to a day. used on the plan screen.

import { useState } from "react";
import { addtask } from "../lib/queries";

interface props {
  day: string; // which day the new task belongs to
  onadded: () => void; // let the parent refresh its list
}

export default function Add({ day, onadded }: props) {
  const [title, settitle] = useState("");
  const [est, setest] = useState(1);
  const [dread, setdread] = useState(false);
  const [note, setnote] = useState("");
  const [open, setopen] = useState(false); // note box stays hidden until asked

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return; // nothing to add
    addtask({ title: t, note, dread, estpomos: est, planfor: day });
    // wipe the form but keep the dread toggle, people add streaks of them
    settitle("");
    setnote("");
    setest(1);
    setopen(false);
    onadded();
  }

  return (
    <form className="add" onSubmit={submit}>
      <div className="add-row">
        <input
          className="add-title"
          placeholder="what needs doing?"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />
        <label className="add-est" title="rough number of focus blocks">
          <span>blocks</span>
          <input
            type="number"
            min={1}
            max={12}
            value={est}
            onChange={(e) => setest(Number(e.target.value))}
          />
        </label>
        <button className="btn primary" type="submit">
          Add
        </button>
      </div>

      <div className="add-row sub">
        <label className={`dreadtoggle ${dread ? "on" : ""}`}>
          <input
            type="checkbox"
            checked={dread}
            onChange={(e) => setdread(e.target.checked)}
          />
          I keep putting this off
        </label>
        <button
          type="button"
          className="linkbtn"
          onClick={() => setopen((o) => !o)}
        >
          {open ? "hide note" : "add a note"}
        </button>
      </div>

      {open && (
        <textarea
          className="add-note"
          placeholder="why does this matter / where do you get stuck?"
          value={note}
          onChange={(e) => setnote(e.target.value)}
          rows={2}
        />
      )}
    </form>
  );
}
