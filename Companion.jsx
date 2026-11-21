import { useState } from "react";
import Toggle from "../components/Toggle";
import { usePrefs } from "../context/AccessibilityContext";
import { useStored } from "../lib/useStored";

const initial = {
  name: "",
  phone: "",
  shareStatus: false,
  shareDelivery: false,
  shareCart: false,
  request: "",
};

export default function Companion() {
  const { announce } = usePrefs();
  const [c, setC] = useStored("companion", initial);
  const [form, setForm] = useState({ name: c.name, phone: c.phone });
  const [errors, setErrors] = useState({});
  const set = (patch) => setC((x) => ({ ...x, ...patch }));
  const saved = c.name && c.phone;

  function save(e) {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Please enter a name.";
    if (!/^\d{10}$/.test(form.phone)) err.phone = "Enter a 10 digit phone number.";
    setErrors(err);
    if (Object.keys(err).length) {
      announce("Please fix the errors in the form");
      return;
    }
    set({ name: form.name.trim(), phone: form.phone });
    announce("Trusted contact saved. Nothing is shared until you turn it on.");
  }

  function remove() {
    setC(initial);
    setForm({ name: "", phone: "" });
    announce("Trusted contact removed. Nothing is shared.");
  }

  function ask(type) {
    set({ request: type });
    announce(type + " sent to " + c.name + " (simulated)");
  }

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Trusted Shopping Companion</h1>
      <p className="mut">
        Optional. Choose someone you trust. <b>Nothing is shared unless you turn it on</b>, and you can remove them at any time.{" "}
        <span className="badge sim">Messages simulated</span>
      </p>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <form className="card" onSubmit={save} noValidate>
          <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>Trusted contact</h2>

          <label htmlFor="cname" style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>Name</label>
          <input id="cname" className="field" style={{ width: "100%" }} value={form.name}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "cname-err" : undefined}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p id="cname-err" role="alert" className="no" style={{ margin: "4px 0" }}>{errors.name}</p>}

          <label htmlFor="cphone" style={{ display: "block", fontWeight: 700, margin: "14px 0 4px" }}>Phone number</label>
          <input id="cphone" className="field" style={{ width: "100%" }} inputMode="numeric" value={form.phone}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "cphone-err" : undefined}
            onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
          {errors.phone && <p id="cphone-err" role="alert" className="no" style={{ margin: "4px 0" }}>{errors.phone}</p>}

          <div className="row" style={{ marginTop: 16 }}>
            <button type="submit" className="btn btn-p">Save contact</button>
            {saved && <button type="button" className="btn" onClick={remove}>Remove and stop sharing</button>}
          </div>
        </form>

        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>What may {saved ? c.name : "your contact"} see?</h2>
          {!saved && <p className="mut">Save a contact first.</p>}
          <fieldset disabled={!saved} style={{ border: 0, padding: 0, margin: 0 }}>
            <Toggle label="Order status" checked={c.shareStatus} onChange={(v) => set({ shareStatus: v })} />
            <Toggle label="Delivery instructions" checked={c.shareDelivery} onChange={(v) => set({ shareDelivery: v })} />
            <Toggle label="What is in my cart" checked={c.shareCart} onChange={(v) => set({ shareCart: v })} />
          </fieldset>

          <h2 style={{ fontSize: "1.25rem", margin: "18px 0 8px" }}>Ask for help</h2>
          <div className="row">
            <button className="btn" disabled={!saved} onClick={() => ask("Shopping help request")}>Request shopping help</button>
            <button className="btn" disabled={!saved} onClick={() => ask("Checkout help request")}>Ask for help at checkout</button>
          </div>
          {c.request && <p role="status" className="ok">✓ {c.request} sent (simulated).</p>}
        </div>
      </div>
    </div>
  );
}