// plain-node sanity checks for the rules the app leans on: how a day key is
// built, how completion percent rounds, and that dreaded tasks sort first.
// these mirror lib/queries so a logic change that breaks them gets noticed.
// run with: npm test

let pass = 0;
let fail = 0;

function ok(name, cond) {
  if (cond) {
    pass++;
    console.log("  ok  - " + name);
  } else {
    fail++;
    console.log("  FAIL- " + name);
  }
}

// same shape as queries.daykey
function daykey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// same rounding queries/usestats use
function percent(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

// same comparator as tasksfor
function dreadfirst(a, b) {
  if (a.dread !== b.dread) return a.dread ? -1 : 1;
  return a.createdat - b.createdat;
}

console.log("daykey");
ok("pads single digit month/day", daykey(new Date(2026, 0, 5)) === "2026-01-05");
ok("keeps two digit month/day", daykey(new Date(2026, 11, 24)) === "2026-12-24");

console.log("percent");
ok("empty day is 0", percent(0, 0) === 0);
ok("half rounds clean", percent(1, 2) === 50);
ok("one of three rounds to 33", percent(1, 3) === 33);
ok("all done is 100", percent(4, 4) === 100);

console.log("sort");
const list = [
  { title: "easy", dread: false, createdat: 1 },
  { title: "scary", dread: true, createdat: 2 },
  { title: "older easy", dread: false, createdat: 0 },
];
const sorted = [...list].sort(dreadfirst).map((t) => t.title);
ok("dread floats to top", sorted[0] === "scary");
ok("ties break by created time", sorted[1] === "older easy");

console.log("");
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
