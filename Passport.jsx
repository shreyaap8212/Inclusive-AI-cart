import { usePrefs } from "../context/AccessibilityContext";
import Toggle from "../components/Toggle";
import { products } from "../data/products";
import { fit } from "../lib/accessfit";

const needsList = [
  ["visual", "Visual support"],
  ["hearing", "Hearing support"],
  ["mobility", "Mobility support"],
  ["cognitive", "Cognitive support"],
];

export default function Passport() {
  const { prefs, set, announce } = usePrefs();
  const sample = products[0];
  const f = fit(sample, prefs.needs);

  function toggleNeed(key, isOn) {
    const needs = isOn
      ? [...prefs.needs, key]
      : prefs.needs.filter((n) => n !== key);
    set({ needs });
    announce(needs.length + " support options selected");
  }

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Accessibility Passport</h1>
      <p className="mut" style={{ marginBottom: 24 }}>
        Pick what helps you. You can choose more than one, and you never have
        to share a diagnosis. Changes apply instantly and are saved on this
        device.
      </p>

      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>What helps you shop?</h2>
          {needsList.map(([key, label]) => (
            <Toggle
              key={key}
              label={label}
              checked={prefs.needs.includes(key)}
              onChange={(on) => toggleNeed(key, on)}
            />
          ))}

          <h2 style={{ fontSize: "1.25rem", margin: "20px 0 4px" }}>Display</h2>
          <Toggle
            label="High contrast"
            checked={prefs.hc}
            onChange={(v) => {
              set({ hc: v });
              announce(v ? "High contrast on" : "High contrast off");
            }}
          />
          <Toggle
            label="Easy mode: fewer visuals, shorter text"
            checked={prefs.calm}
            onChange={(v) => set({ calm: v })}
          />
          <Toggle
            label="Large touch targets"
            checked={prefs.big}
            onChange={(v) => set({ big: v })}
          />
          <Toggle
            label="Read updates aloud (turn off if you use a screen reader)"
            checked={prefs.voice}
            onChange={(v) => set({ voice: v })}
          />

          <label
            htmlFor="textsize"
            style={{ display: "block", margin: "16px 0 4px", fontWeight: 700 }}
          >
            Text size
          </label>
          <select
            id="textsize"
            className="field"
            value={prefs.text}
            onChange={(e) => set({ text: Number(e.target.value) })}
          >
            <option value={1}>Normal</option>
            <option value={1.25}>Large</option>
            <option value={1.5}>Extra large</option>
          </select>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>Live preview</h2>
          <div className="deco" style={{ fontSize: "2.4rem" }} aria-hidden="true">
            {sample.emoji}
          </div>
          <h3 style={{ margin: "4px 0" }}>{sample.name}</h3>
          <p className="mut">
            {prefs.calm ? sample.desc.split(".")[0] + "." : sample.desc}
          </p>
          <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>
            {f.score === null ? "Information not verified" : f.score + "% match"}
          </p>
          <button className="btn btn-p">Add to cart</button>

          <p className="mut" style={{ marginTop: 16 }}>
            Eye control, facial gestures and sign-language translation need
            compatible hardware or a validated service.{" "}
            <span className="badge sim">Not active in this demo</span>
          </p>
        </div>
      </div>
    </div>
  );
}