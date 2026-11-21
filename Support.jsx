import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePrefs } from "../context/AccessibilityContext";
import { products } from "../data/products";

const TABS = ["Hearing", "Mobility", "Sign language", "See & Shop"];

const MOBILITY_ITEMS = ["Shop", "Cart", "Checkout", "Help"];

/* ---------- HEARING ---------- */

function Hearing() {
  const { announce } = usePrefs();

  const [text, setText] = useState("");
  const [on, setOn] = useState(false);
  const [alertOn, setAlertOn] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      from: "Support",
      text: "Hello! Type your question and we will reply here."
    }
  ]);
  const [draft, setDraft] = useState("");

  const rec = useRef(null);

  useEffect(() => {
    return () => {
      if (rec.current) {
        rec.current.stop();
      }
    };
  }, []);

  function toggleCaptions() {
    if (on) {
      if (rec.current) rec.current.stop();
      return;
    }

    const SR =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SR) {
      announce(
        "Live captions are not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    const r = new SR();

    r.lang = "en-IN";
    r.continuous = true;
    r.interimResults = true;

    r.onresult = (e) => {
      let t = "";

      for (let i = 0; i < e.results.length; i++) {
        t += e.results[i][0].transcript + " ";
      }

      setText(t);
    };

    r.onend = () => setOn(false);

    r.onerror = () => {
      announce("Captions stopped. Check microphone permission.");
    };

    r.start();

    rec.current = r;
    setOn(true);
  }

  function showAlert() {
    setAlertOn(true);

    setTimeout(() => {
      setAlertOn(false);
    }, 4000);

    if (navigator.vibrate) {
      navigator.vibrate(300);
    } else {
      announce(
        "Vibration is not supported on this device. The visual alert is shown instead."
      );
    }
  }

  function send(e) {
    e.preventDefault();

    if (!draft.trim()) return;

    setMsgs((m) => [
      ...m,
      { from: "You", text: draft.trim() }
    ]);

    setDraft("");

    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          from: "Support",
          text: "Thanks. An agent will reply in this chat. (Simulated reply)"
        }
      ]);
    }, 800);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px, 1fr))"
      }}
    >
      <section className="card" aria-labelledby="cap">
        <h2 id="cap" style={{ marginTop: 0, fontSize: "1.2rem" }}>
          Live captions
        </h2>

        <p className="mut">
          Turns speech into text using your browser.
          <span className="badge">Real, browser-based</span>
        </p>

        <button
          className="btn btn-p"
          aria-pressed={on}
          onClick={toggleCaptions}
        >
          {on ? "Stop captions" : "Start captions"}
        </button>

        <div
          aria-live="polite"
          style={{
            marginTop: 12,
            minHeight: 80,
            fontSize: "1.3rem"
          }}
        >
          {text || (
            <span className="mut">
              Captions appear here.
            </span>
          )}
        </div>
      </section>

      <section className="card" aria-labelledby="alerts">
        <h2 id="alerts" style={{ marginTop: 0, fontSize: "1.2rem" }}>
          Visual and vibration alerts
        </h2>

        <p className="mut">
          Preview how an order update looks without sound.
          <span className="badge sim">Simulated</span>
        </p>

        <button className="btn btn-p" onClick={showAlert}>
          Preview order alert
        </button>

        {alertOn && (
          <div
            role="alert"
            style={{
              marginTop: 12,
              padding: 16,
              borderRadius: 14,
              background: "var(--pri)",
              color: "var(--on)",
              fontWeight: 700,
              fontSize: "1.2rem"
            }}
          >
            📦 Your order is out for delivery
          </div>
        )}
      </section>

      <section
        className="card"
        aria-labelledby="chat"
        style={{ gridColumn: "1 / -1" }}
      >
        <h2 id="chat" style={{ marginTop: 0, fontSize: "1.2rem" }}>
          Text-based support
        </h2>

        <p className="mut">
          Two-way written communication.
          <span className="badge sim">Replies simulated</span>
        </p>

        <ul
          aria-live="polite"
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 12px"
          }}
        >
          {msgs.map((m, i) => (
            <li key={i} style={{ margin: "6px 0" }}>
              <b>{m.from}:</b> {m.text}
            </li>
          ))}
        </ul>

        <form className="row" onSubmit={send}>
          <label htmlFor="msg" className="sr-only">
            Your message
          </label>

          <input
            id="msg"
            className="field"
            style={{ flex: 1, minWidth: 200 }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your message"
          />

          <button className="btn btn-p" type="submit">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

/* ---------- MOBILITY ---------- */

function Mobility() {
  const { prefs, set, announce } = usePrefs();

  const [scan, setScan] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState("");

  const choose = useCallback(() => {
    setPicked(MOBILITY_ITEMS[idx]);
    announce(MOBILITY_ITEMS[idx] + " selected");
    setScan(false);
  }, [idx, announce]);

  useEffect(() => {
    if (!scan) return;

    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MOBILITY_ITEMS.length);
    }, 1500);

    return () => clearInterval(t);
  }, [scan]);

  useEffect(() => {
    if (!scan) return;

    function onKey(e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        choose();
      }
    }

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [scan, choose]);

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px, 1fr))"
      }}
    >
      <section className="card" aria-labelledby="sw">
        <h2 id="sw" style={{ marginTop: 0, fontSize: "1.2rem" }}>
          Switch-access scanning
        </h2>

        <p className="mut">
          The highlight moves on its own. Press <b>Space</b> or
          <b> Enter</b> (or any single switch mapped to them) to choose.
          <span className="badge sim">Demonstration</span>
        </p>

        <div className="row">
          {MOBILITY_ITEMS.map((it, i) => (
            <span
              key={it}
              className="btn"
              style={{
                minWidth: 90,
                outline:
                  scan && i === idx
                    ? "4px solid var(--pri)"
                    : "none",
                background:
                  scan && i === idx
                    ? "var(--pri)"
                    : "var(--card)",
                color:
                  scan && i === idx
                    ? "var(--on)"
                    : "var(--fg)"
              }}
            >
              {it}
            </span>
          ))}
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button
            className="btn btn-p"
            onClick={() => {
              setPicked("");
              setScan((s) => !s);
            }}
          >
            {scan ? "Stop scanning" : "Start scanning"}
          </button>

          {scan && (
            <button className="btn" onClick={choose}>
              Select highlighted
            </button>
          )}
        </div>

        {picked && (
          <p role="status" className="ok">
            ✓ You chose: {picked}
          </p>
        )}
      </section>

      <section className="card" aria-labelledby="tg">
        <h2 id="tg" style={{ marginTop: 0, fontSize: "1.2rem" }}>
          Touch target size
        </h2>

        <p className="mut">
          Make every button bigger across the whole app.
        </p>

        <button
          className="btn btn-p"
          aria-pressed={prefs.big}
          onClick={() => {
            set({ big: !prefs.big });
            announce(
              prefs.big ? "Normal buttons" : "Large buttons"
            );
          }}
        >
          {prefs.big
            ? "Large targets: on"
            : "Large targets: off"}
        </button>

        <p className="mut" style={{ marginTop: 12 }}>
          Voice control works from every page. Press the
          <b> Talk </b> button or the <b>V</b> key.
        </p>
      </section>

      <section
        className="card"
        aria-labelledby="eye"
        style={{ gridColumn: "1 / -1" }}
      >
        <h2 id="eye" style={{ marginTop: 0, fontSize: "1.2rem" }}>
          Eye control and facial gestures
        </h2>

        <p className="mut" style={{ margin: 0 }}>
          These need compatible eye-tracking hardware or a validated
          gesture service. InclusiCart is ready to work with standard
          assistive devices that act as a keyboard or pointer.
          <span className="badge sim">
            Not active in this demo
          </span>
        </p>
      </section>
    </div>
  );
}

/* ---------- SIGN LANGUAGE ---------- */

const PHRASES = [
  ["👋", "Hello"],
  ["🙏", "Thank you"],
  ["✅", "Yes"],
  ["❌", "No"],
  ["🆘", "I need help"],
  ["💰", "What is the price?"],
  ["🛒", "I want to buy this"],
  ["💳", "I want to pay"]
];

function Sign() {
  const { announce } = usePrefs();
  const [p, setP] = useState(null);

  return (
    <div>
      <p className="mut">
        Tap a phrase to show it as a large visual card to a shop
        assistant or delivery partner.
        <span className="badge sim">
          Demonstration only, not validated sign-language translation
        </span>
      </p>

      <div className="grid">
        {PHRASES.map(([e, t]) => (
          <button
            key={t}
            className="card"
            style={{
              cursor: "pointer",
              textAlign: "center",
              font: "inherit",
              color: "inherit"
            }}
            onClick={() => {
              setP([e, t]);
              announce(t);
            }}
          >
            <div aria-hidden="true" style={{ fontSize: "2.4rem" }}>
              {e}
            </div>
            <b>{t}</b>
          </button>
        ))}
      </div>

      {p && (
        <div
          role="status"
          className="card"
          style={{
            marginTop: 16,
            textAlign: "center"
          }}
        >
          <div aria-hidden="true" style={{ fontSize: "4rem" }}>
            {p[0]}
          </div>

          <div style={{ fontSize: "2.4rem", fontWeight: 700 }}>
            {p[1]}
          </div>
        </div>
      )}

      <p className="mut" style={{ marginTop: 16 }}>
        A sign-language avatar and real translation are on the
        roadmap and need a validated service and review by Deaf users.
      </p>
    </div>
  );
}

/* ---------- SEE & SHOP ---------- */

function SeeShop() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [match, setMatch] = useState(undefined);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  function onPick(e) {
    const f = e.target.files[0];

    if (!f) return;

    setUrl(URL.createObjectURL(f));
    setName(f.name);

    const n = f.name.toLowerCase();

    setMatch(
      products.find((p) =>
        p.name
          .toLowerCase()
          .split(" ")
          .some((w) => w.length > 3 && n.includes(w))
      ) || null
    );
  }

  return (
    <div className="card">
      <p className="mut">
        Take or upload a photo of a product. Real recognition needs
        an AI vision service.
        <span className="badge sim">
          Simulated: matches on the file name only
        </span>
      </p>

      <label
        htmlFor="photo"
        style={{
          display: "block",
          fontWeight: 700,
          marginBottom: 4
        }}
      >
        Take or choose a photo
      </label>

      <input
        id="photo"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPick}
      />

      <p className="mut">
        Your photo stays on this device and is not uploaded.
      </p>

      {url && (
        <img
          src={url}
          alt={"Your photo: " + name}
          style={{
            maxWidth: "100%",
            maxHeight: 260,
            borderRadius: 14
          }}
        />
      )}

      {match === null && (
        <p role="status" className="unk">
          Could not identify this product in the demo. Try the
          <Link to="/shop"> search </Link>
          instead, or rename the file to something like "kettle.jpg".
        </p>
      )}

      {match && (
        <p role="status" className="ok">
          Possible match: <b>{match.name}</b> (₹{match.price}).
          <Link to="/shop"> Open the shop</Link>
        </p>
      )}
    </div>
  );
}

/* ---------- MAIN SUPPORT PAGE ---------- */

export default function Support() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>
        More ways to shop
      </h1>

      <p className="mut">
        Demonstration screens. Each one says whether it is real
        or simulated.
      </p>

      <div
        className="row"
        role="group"
        aria-label="Choose a demo"
        style={{ margin: "14px 0" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            className={"btn" + (tab === t ? " btn-p" : "")}
            aria-pressed={tab === t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Hearing" && <Hearing />}
      {tab === "Mobility" && <Mobility />}
      {tab === "Sign language" && <Sign />}
      {tab === "See & Shop" && <SeeShop />}
    </div>
  );
}