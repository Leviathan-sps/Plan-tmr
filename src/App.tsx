// app shell: top nav + whatever page is active. the nav hides itself on the
// landing page so the intro feels like its own thing.

import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function App() {
  const loc = useLocation();
  const onlanding = loc.pathname === "/";

  return (
    <div className="shell">
      {!onlanding && (
        <header className="nav">
          <NavLink to="/" className="brand">
            <img src="/tomato.svg" alt="" width={22} height={22} />
            <span>Tomoro</span>
          </NavLink>
          <nav className="navlinks">
            <NavLink to="/plan">Plan tomorrow</NavLink>
            <NavLink to="/today">Today</NavLink>
            <NavLink to="/progress">Progress</NavLink>
          </nav>
        </header>
      )}

      <main className={onlanding ? "page wide" : "page"}>
        <Outlet />
      </main>

      {!onlanding && (
        <footer className="foot">
          <span>made for the stuff you keep putting off</span>
        </footer>
      )}
    </div>
  );
}
