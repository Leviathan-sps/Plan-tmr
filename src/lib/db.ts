// tiny localstorage wrapper. no backend, the whole point is it works offline at night.

// const prefix = "tomoro.";  // old one, bumped to v1 after i changed the task shape
const prefix = "tomoro.v1.";

// const debug = false;  // todo: gate the console logs behind this someday

// read a key, fall back if it's missing or corrupt
export function read<t>(key: string, fallback: t): t {
  try {
    const raw = localStorage.getItem(prefix + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as t;
  } catch {
    // bad json, don't crash the app over it
    return fallback;
  }
}

// write a key, swallow quota errors quietly
export function write<t>(key: string, value: t): void {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  } catch {
    // storage full or blocked, nothing we can do here
  }
}

// short random id, good enough for local stuff
export function newid(): string {
  return Math.random().toString(36).slice(2, 10);
  // return Date.now().toString();  // had this before, got dupes when adding fast
}

// not used anymore, kept it incase i wanna wipe everything for testing
function clearall() {
  localStorage.clear();
}
