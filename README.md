# Tomoro

Plan tomorrow tonight, then actually do the stuff you keep putting off.

Most to-do apps get planned in the morning when you're already tired. Tomoro
flips it: you set up tomorrow the night before, flag the tasks you usually
dodge, and run short focus blocks through them the next day. At night you look
back at what the day added up to.

Inspired by pomodorotimer.online, pointed at procrastination.

## What's inside

- **Plan tomorrow** — add tasks for the next day, guess focus blocks, flag the
  dreaded ones (they sort to the top).
- **Today** — a pomodoro timer wired to your list, a progress strip, tweakable
  focus/break lengths.
- **Progress** — end of day review: completion ring, dreaded tasks beaten,
  minutes focused, and a seven day strip.

Everything is stored in your browser's localStorage. No accounts, no server.

## Run it

```bash
npm install
npm run dev      # opens http://localhost:5180
```

Other scripts:

```bash
npm run build    # typecheck + production build
npm test         # node sanity checks for the core rules
```

## Layout

See `CODEMAP.md` for the file-by-file breakdown. Short version: pages in
`src/pages`, reusable bits in `src/components`, storage + logic in `src/lib`,
the one stat hook in `src/hooks`.
