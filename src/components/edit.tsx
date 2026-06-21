// inline editor for a task. shows up in place of the row when you hit edit.

import { useState } from "react";
import { task } from "../lib/types";
import { updatetask } from "../lib/queries";

interface props {
  t: task;
  onsaved: () => void;
  oncancel: () => void;
}

export default function Edit({ t, onsaved, oncancel }: props) {
  const [title, settitle] = useState(t.title);
  const [est, setest] = useState(t.estpomos);
  const [dread, setdread] = useState(t.dread);

  function save() {
    updatetask(t.id, { title: title.trim() || t.title, estpomos: est, dread });
    onsaved();
  }

  return (
    <div className="row editing">
      <input
        className="add-title"
        value={title}
        onChange={(e) => settitle(e.target.value)}
      />
      <input
        type="number"
        min={1}
        max={12}
        value={est}
        onChange={(e) => setest(Number(e.target.value))}
      />
      <label className={`dreadtoggle ${dread ? "on" : ""}`}>
        <input
          type="checkbox"
          checked={dread}
          onChange={(e) => setdread(e.target.checked)}
        />
        dread
      </label>
      <button className="btn primary" onClick={save}>
        save
      </button>
      <button className="linkbtn" onClick={oncancel}>
        cancel
      </button>
    </div>
  );
}
