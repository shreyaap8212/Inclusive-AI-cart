import { useState } from "react";
import Toggle from "../components/Toggle";
import { usePrefs } from "../context/AccessibilityContext";
import { useStored } from "../lib/useStored";

const initial = {
  textInstead: true,
  visualAlert: true,
  audioAlert: false,
  extraTime: "0",
  handover: "hand",
  contact: "sms",
  notes: "",
};

const HANDOVER = {
  hand: "Hand the parcel to me",
  door: "Leave it at the door and message me",
  neighbour: "Leave it with a neighbour",
  trusted: "Leave it with my trusted contact",
};
const CONTACT = { sms: "Text message", app: "In-app message", call: "Phone call" };

export default function Delivery() {
  const { announce } = usePrefs();
  const [d, setD] = useStored("delivery", initial);
  const [copied, setCopied] = useState(false);
  const set = (patch) => setD((x) => ({ ...x, ...patch }));

  const summary = [
    "Delivery instructions:",
    "- Contact me by: " + (d.textInstead ? "text message (please do not call)" : CONTACT[d.contact]),
    "- Handover: " + HANDOVER[d.handover],
    "- Extra time to reach the door: " + (d.extraTime === "0" ? "none needed" : d.extraTime + " minutes"),
    "- Arrival alert: " + [d.visualAlert && "visual", d.audioAlert && "audio"].filter(Boolean).join(" and ") || "none",
    d.notes ? "- Notes: " + d.notes : "",
  ].filter(Boolean).join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      announce("Delivery instructions copied");
    } catch {
      announce("Copy is not available. Select the text and copy it manually.");
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Smart Delivery Passport</h1>
      <p className="mut">
        Tell delivery partners how you prefer to be reached. Saved on this device.{" "}
        <span className="badge sim">Sharing with partners simulated</span>
      </p>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>Your preferences</h2>
          <Toggle label="Text message instead of a phone call" checked={d.textInstead} onChange={(v) => set({ textInstead: v })} />
          <Toggle label="Visual arrival alert (screen flash)" checked={d.visualAlert} onChange={(v) => set({ visualAlert: v })} />
          <Toggle label="Audio arrival alert" checked={d.audioAlert} onChange={(v) => set({ audioAlert: v })} />

          <label htmlFor="contact" style={{ display: "block", margin: "14px 0 4px", fontWeight: 700 }}>Preferred communication</label>
          <select id="contact" className="field" value={d.contact} onChange={(e) => set({ contact: e.target.value })}>
            {Object.entries(CONTACT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <label htmlFor="handover" style={{ display: "block", margin: "14px 0 4px", fontWeight: 700 }}>Handover</label>
          <select id="handover" className="field" value={d.handover} onChange={(e) => set({ handover: e.target.value })}>
            {Object.entries(HANDOVER).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <label htmlFor="extra" style={{ display: "block", margin: "14px 0 4px", fontWeight: 700 }}>Extra time to reach the door</label>
          <select id="extra" className="field" value={d.extraTime} onChange={(e) => set({ extraTime: e.target.value })}>
            <option value="0">No extra time</option>
            <option value="2">2 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
          </select>

          <label htmlFor="notes" style={{ display: "block", margin: "14px 0 4px", fontWeight: 700 }}>Special instructions</label>
          <textarea id="notes" className="field" rows={3} maxLength={200} value={d.notes}
            onChange={(e) => set({ notes: e.target.value })}
            placeholder="For example: please knock twice and speak clearly"
            style={{ width: "100%", padding: 10 }} />
          <p className="mut" style={{ margin: "4px 0 0" }}>{d.notes.length}/200. Do not include OTPs, PINs or passwords.</p>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>What the delivery partner sees</h2>
          <pre style={{ whiteSpace: "pre-wrap", font: "inherit", margin: "0 0 14px" }}>{summary}</pre>
          <button className="btn btn-p" onClick={copy}>{copied ? "Copied ✓" : "Copy instructions"}</button>
        </div>
      </div>
    </div>
  );
}