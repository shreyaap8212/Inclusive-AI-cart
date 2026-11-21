
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const wrap = { maxWidth: 1000, margin: "0 auto", padding: "0 20px" };
const section = { margin: "56px 0" };
const grid = { display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

const cardBtn = {
  width: "100%",
  textAlign: "left",
  borderRadius: 20,
  border: "2px solid var(--bd)",
  background: "var(--card)",
  color: "var(--fg)",
  padding: 24,
  cursor: "pointer",
  font: "inherit",
};

const categories = [
  ["👁️", "Visual", "Voice shopping, read-aloud product labels, high contrast and large text."],
  ["👂", "Hearing", "Captions, text-based support and visual order and delivery alerts."],
  ["🖐️", "Mobility", "Large targets, keyboard and voice control, and simpler checkout."],
  ["🧠", "Cognitive", "Easy mode, plain language, one step at a time and no rush."],
];

const features = [
  ["Accessibility Passport", "Set your preferences once. They shape every page, from search to delivery."],
  ["AccessFit 360", "A match score for each product based on your needs. Unverified details are never guessed."],
  ["Try Before You Buy", "Hear a product label read aloud and enlarge its instructions before you buy."],
  ["BlindPay", "Voice-guided checkout with a spoken summary. UPI approval always happens in your own UPI app."],
  ["Confidence checkout", "Review, edit and confirm. Nothing is ordered without your clear yes."],
  ["Trusted Companion", "Optional. Share only what you choose with someone you trust."],
];

const steps = [
  ["1", "Set your Passport", "Choose the settings that help. No diagnosis needed."],
  ["2", "Discover", "Search by voice or text. See how well each product fits you."],
  ["3", "Decide", "Compare products and find better matches."],
  ["4", "Check out", "Review, hear your summary, then confirm."],
  ["5", "Track", "Follow your order with delivery notes that suit you."],
];

const quotes = [
  ["I could finally check a product before buying it.", "Sample user A"],
  ["The spoken order summary made checkout feel safe.", "Sample user B"],
  ["Big buttons and fewer steps. I did not need help.", "Sample user C"],
];

export default function Welcome() {
  const navigate = useNavigate();
  const [hc, setHc] = useState(false);
  const [large, setLarge] = useState(false);

  // this demo card only changes itself, not the whole site
  const demo = {
    background: hc ? "#000" : "#fff",
    color: hc ? "#fff" : "#14163a",
    border: hc ? "2px solid #ffe600" : "1px solid #d9dcef",
    borderRadius: 20,
    padding: 18,
    fontSize: large ? "1.4rem" : "1rem",
  };

  return (
    <div>
      <header style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
        <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>InclusiCart</span>
        <Link className="btn" to="/shop">Skip to shop</Link>
      </header>

      <main id="main" style={wrap}>
        {/* HERO */}
        <section
          style={{
            background: "linear-gradient(135deg, #1c1d6b, #3b3bd6 55%, #0f9d9a)",
            color: "#fff",
            borderRadius: 28,
            padding: "clamp(24px, 5vw, 48px)",
            display: "grid",
            gap: 28,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.1, margin: "0 0 12px" }}>
              Shopping without barriers.
            </h1>
            <p style={{ fontSize: "1.15rem", margin: "0 0 8px" }}>
              One platform. Every ability. Independent shopping for everyone.
            </p>
            <p style={{ margin: 0 }}>You never have to share a diagnosis.</p>
          </div>

          <div style={demo}>
            <p style={{ margin: "0 0 8px", fontWeight: 700 }}>Try it: one product, adapted</p>
            <div aria-hidden="true" style={{ fontSize: "2.2rem" }}>🧴</div>
            <h2 style={{ margin: "4px 0", fontSize: "1.2em" }}>Flip-lid water bottle</h2>
            <p style={{ margin: "0 0 12px" }}>One-hand flip lid. 100% match for limited hand strength.</p>
            <div className="row">
              <button className="btn" aria-pressed={hc} onClick={() => setHc(!hc)}>High contrast</button>
              <button className="btn" aria-pressed={large} onClick={() => setLarge(!large)}>Large text</button>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: ".8rem" }}>Sample product and sample data.</p>
          </div>
        </section>

        {/* CHOICE */}
        <section style={section} aria-labelledby="choose">
          <h2 id="choose" style={{ fontSize: "1.6rem" }}>How would you like to shop?</h2>
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <button style={cardBtn} onClick={() => navigate("/shop")}>
              <h3 style={{ fontSize: "1.5rem", margin: "0 0 8px" }}>Normal shopping</h3>
              <p className="mut" style={{ margin: 0 }}>
                Browse with standard settings. You can turn on accessibility any time.
              </p>
            </button>
            <button style={cardBtn} onClick={() => navigate("/passport")}>
              <h3 style={{ fontSize: "1.5rem", margin: "0 0 8px" }}>Accessible shopping</h3>
              <p className="mut" style={{ margin: 0 }}>
                Pick the settings you want and mix as many as you like. Your cart stays safe if you switch.
              </p>
            </button>
          </div>
        </section>

        {/* PROBLEM */}
        <section style={section} aria-labelledby="problem">
          <h2 id="problem" style={{ fontSize: "1.6rem" }}>The problem</h2>
          <p className="mut" style={{ maxWidth: 700 }}>
            Most online stores assume everyone uses a screen in the same way. Small text, image-only product
            details and long checkouts turn a simple purchase into a barrier. Accessibility settings, when they
            exist, are scattered and do not follow you through the journey.
          </p>
          <div style={grid}>
            {[
              ["Visual barriers", "Low contrast, small text and image-only information."],
              ["Interaction barriers", "Complex menus, tiny buttons and time-limited steps."],
              ["Information barriers", "Unclear product details and no audio or text alternatives."],
            ].map(([t, d]) => (
              <div className="card" key={t}>
                <h3 style={{ marginTop: 0 }}>{t}</h3>
                <p className="mut" style={{ margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section style={section} aria-labelledby="who">
          <h2 id="who" style={{ fontSize: "1.6rem" }}>Built for many ways of shopping</h2>
          <div style={grid}>
            {categories.map(([icon, t, d]) => (
              <div className="card" key={t}>
                <div aria-hidden="true" style={{ fontSize: "2rem" }}>{icon}</div>
                <h3 style={{ margin: "4px 0" }}>{t}</h3>
                <p className="mut" style={{ margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
          <p className="mut">Combine any of these. Your needs are yours to choose.</p>
        </section>

        {/* FEATURES */}
        <section style={section} aria-labelledby="features">
          <h2 id="features" style={{ fontSize: "1.6rem" }}>What makes InclusiCart different</h2>
          <div style={grid}>
            {features.map(([t, d]) => (
              <div className="card" key={t}>
                <h3 style={{ marginTop: 0 }}>{t}</h3>
                <p className="mut" style={{ margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={section} aria-labelledby="how">
          <h2 id="how" style={{ fontSize: "1.6rem" }}>How it works</h2>
          <ol style={{ ...grid, listStyle: "none", padding: 0, margin: 0 }}>
            {steps.map(([n, t, d]) => (
              <li className="card" key={n}>
                <span className="badge">Step {n}</span>
                <h3 style={{ margin: "8px 0 4px" }}>{t}</h3>
                <p className="mut" style={{ margin: 0 }}>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* IMPACT + TESTIMONIALS */}
        <section style={section} aria-labelledby="impact">
          <h2 id="impact" style={{ fontSize: "1.6rem" }}>Impact</h2>
          <div style={grid}>
            {[
              ["Independence", "Browse, compare and buy with fewer barriers."],
              ["Confidence", "Clear information and a checkout you can review."],
              ["Inclusion", "Many ways to interact, in one store."],
            ].map(([t, d]) => (
              <div className="card" key={t}>
                <h3 style={{ marginTop: 0 }}>{t}</h3>
                <p className="mut" style={{ margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
          <h3 style={{ margin: "28px 0 8px" }}>
            What users could say <span className="badge sim">Sample content, not real reviews</span>
          </h3>
          <div style={grid}>
            {quotes.map(([q, who]) => (
              <figure className="card" key={who} style={{ margin: 0 }}>
                <blockquote style={{ margin: "0 0 8px" }}>“{q}”</blockquote>
                <figcaption className="mut">{who}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{ ...section, textAlign: "center", border: "2px solid var(--bd)", borderRadius: 24, padding: 32, background: "var(--card)" }}
        >
          <h2 style={{ fontSize: "1.8rem", marginTop: 0 }}>See the difference. Shop with independence.</h2>
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn btn-p" onClick={() => navigate("/passport")}>Start with my Passport</button>
            <button className="btn" onClick={() => navigate("/shop")}>Browse the shop</button>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--bd)", padding: "24px 20px", textAlign: "center" }}>
        <p style={{ margin: 0, fontWeight: 700 }}>InclusiCart: One Platform. Every Ability.</p>
        <p className="mut" style={{ margin: "6px 0 0" }}>
          Hackathon prototype by Team Citadel, Dayananda Sagar University. Products, reviews and payments are
          sample data and simulations.
        </p>
      </footer>
    </div>
  );
}
