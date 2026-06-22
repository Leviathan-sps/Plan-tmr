// the front door. explains the idea before dropping anyone into the app.
// the photo is a real shot from unsplash, with a soft fallback if offline.

import { Link } from "react-router-dom";

// hide a broken image instead of showing the little torn-photo icon
function hideonfail(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.visibility = "hidden";
}

export default function Landing() {
  return (
    <div className="landing">
      <header className="land-top">
        <Link to="/" className="brand big">
          <img src="/tomato.svg" alt="" width={26} height={26} />
          <span>Tomoro</span>
        </Link>
        <Link to="/plan" className="btn primary">
          Plan tomorrow
        </Link>
      </header>

      <section className="hero">
        <div className="hero-text">
          <p className="kicker">a quieter kind of to-do app</p>
          <h1>
            Plan tomorrow tonight.
            <br />
            Do the thing you keep dodging.
          </h1>
          <p className="lede">
            Most to-do lists pile up because we plan in the morning, already
            tired and already behind. Tomoro flips it: spend two minutes the
            night before, flag the task you've been avoiding, then run short
            focus blocks through it the next day.
          </p>
          <div className="hero-cta">
            <Link to="/plan" className="btn primary lg">
              Set up tomorrow
            </Link>
            <Link to="/today" className="btn ghost lg">
              Start a focus block
            </Link>
          </div>
          <p className="fineprint">
            no signup, nothing leaves your browser. it just remembers.
          </p>
        </div>

        <div className="hero-shot">
          <img
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=720&q=70"
            alt="someone writing the next day's plan in a notebook"
            onError={hideonfail}
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <section className="steps">
        <div className="step">
          <span className="step-n">1</span>
          <h3>Plan at night</h3>
          <p>
            Drop tomorrow's tasks in while today is still fresh. Guess how many
            focus blocks each one needs.
          </p>
        </div>
        <div className="step">
          <span className="step-n">2</span>
          <h3>Name the dread</h3>
          <p>
            Tick the ones you usually put off. They float to the top so you face
            them first, not last.
          </p>
        </div>
        <div className="step">
          <span className="step-n">3</span>
          <h3>See the day add up</h3>
          <p>
            Run the timer, check things off, and at night look back at what you
            actually finished.
          </p>
        </div>
      </section>

      <section className="quote">
        <blockquote>
          “The best way to get something done is to begin.” — and beginning is
          easier when tomorrow is already decided.
        </blockquote>
      </section>

      <footer className="land-foot">
        <span>Tomoro</span>
        <Link to="/progress">see your progress →</Link>
      </footer>
    </div>
  );
}
