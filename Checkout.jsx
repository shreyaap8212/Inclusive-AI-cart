import { useState } from "react";
import { Link } from "react-router-dom";
import { usePrefs } from "../context/AccessibilityContext";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import { speak } from "../lib/voice";

const STEPS = ["Review", "Payment", "Confirm", "Result"];

export default function Checkout() {
  const { cart, placeOrder } = useCart();
  const { announce } = usePrefs();
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("upi");
  const [result, setResult] = useState(null);

  const items = products.filter((p) => cart[p.id]).map((p) => ({ ...p, q: cart[p.id] }));
  const total = items.reduce((a, i) => a + i.price * i.q, 0);
  const itemText = items.map((i) => i.q + " × " + i.name).join(", ");
  const methodText = method === "upi" ? "UPI" : "cash on delivery";
  const summary =
    "You are buying " + itemText + ". Total " + total +
    " rupees. Delivery in 3 to 5 days. Returns accepted within 7 days. Payment by " + methodText + ".";

  function goTo(n) {
    setStep(n);
    announce("Step " + (n + 1) + " of 4: " + STEPS[n]);
  }

  function finish(r) {
    if (r === "success") placeOrder({ items: itemText, total, method: methodText });
    setResult(r);
    setStep(3);
    announce(
      {
        success: "Payment complete. Order placed.",
        pending: "Payment pending. Nothing has been ordered yet.",
        failed: "Payment declined. You were not charged.",
      }[r]
    );
  }

  if (items.length === 0 && !result) {
    return (
      <div>
        <h1>Checkout</h1>
        <div className="card">
          Nothing to pay for yet. <Link to="/shop">Go to the shop</Link>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>BlindPay</h1>
      <ol
        aria-label="Checkout steps"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", listStyle: "none", padding: 0 }}
      >
        {STEPS.map((s, i) => (
          <li
            key={s}
            aria-current={i === step ? "step" : undefined}
            style={{
              padding: "6px 14px",
              borderRadius: 99,
              border: "1px solid var(--bd)",
              background: i === step ? "var(--pri)" : "transparent",
              color: i === step ? "var(--on)" : "var(--fg)",
              fontWeight: i === step ? 700 : 400,
            }}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Review your order</h2>
          <ul>
            {items.map((i) => (
              <li key={i.id}>
                {i.q} × {i.name}: ₹{i.price * i.q}
              </li>
            ))}
          </ul>
          <p>
            <b>Total ₹{total}</b>
            <br />
            Delivery: 3 to 5 days to your saved address
            <br />
            Returns: within 7 days
          </p>
          <div className="row">
            <button className="btn" onClick={() => speak(summary)}>
              🔊 Read summary aloud
            </button>
            <Link className="btn" to="/cart">
              Edit cart
            </Link>
            <button className="btn btn-p" onClick={() => goTo(1)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Choose how to pay</h2>
          <label className="row" style={{ minHeight: "var(--t)" }}>
            <input type="radio" name="pm" checked={method === "upi"} onChange={() => setMethod("upi")} />
            UPI (approve in your UPI app)
          </label>
          <label className="row" style={{ minHeight: "var(--t)" }}>
            <input type="radio" name="pm" checked={method === "cod"} onChange={() => setMethod("cod")} />
            Cash on delivery
          </label>
          <p className="mut">
            InclusiCart never asks for, reads aloud or stores your UPI PIN or OTP. You approve inside your UPI
            app. <span className="badge sim">Handoff simulated</span>
          </p>
          <div className="row">
            <button className="btn" onClick={() => goTo(0)}>
              Back
            </button>
            <button className="btn btn-p" onClick={() => goTo(2)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Confirm your order</h2>
          <p style={{ fontSize: "1.3rem" }}>{summary}</p>
          <div className="row">
            <button className="btn" onClick={() => speak(summary)}>
              🔊 Read aloud
            </button>
            <button className="btn" onClick={() => goTo(1)}>
              Back
            </button>
            {method === "upi" ? (
              <button className="btn btn-p" onClick={() => goTo(3)}>
                Place order and open UPI app
              </button>
            ) : (
              <button className="btn btn-p" onClick={() => finish("success")}>
                Place order
              </button>
            )}
          </div>
          <p className="mut">Nothing is ordered until you press the button.</p>
        </div>
      )}

      {step === 3 && result === null && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Waiting for your UPI app</h2>
          <p>
            Approve the payment in your UPI app.{" "}
            <span className="badge sim">Simulated: choose an outcome</span>
          </p>
          <div className="row">
            <button className="btn" onClick={() => finish("success")}>
              Approved
            </button>
            <button className="btn" onClick={() => finish("pending")}>
              Still pending
            </button>
            <button className="btn" onClick={() => finish("failed")}>
              Declined
            </button>
          </div>
        </div>
      )}

      {step === 3 && result === "success" && (
        <div className="card">
          <h2 className="ok" style={{ marginTop: 0 }}>
            Order placed
          </h2>
          <p>We will send updates. You can follow your order in Orders.</p>
          <Link className="btn btn-p" to="/orders">
            View orders
          </Link>
        </div>
      )}

      {step === 3 && result === "pending" && (
        <div className="card">
          <h2 className="unk" style={{ marginTop: 0 }}>
            Payment pending
          </h2>
          <p>Nothing has been ordered yet. Check your UPI app, or try again.</p>
          <div className="row">
            <button
              className="btn"
              onClick={() => {
                setResult(null);
                goTo(1);
              }}
            >
              Change method
            </button>
            <button className="btn btn-p" onClick={() => finish("success")}>
              Check again (demo: succeeds)
            </button>
          </div>
        </div>
      )}

      {step === 3 && result === "failed" && (
        <div className="card">
          <h2 className="no" style={{ marginTop: 0 }}>
            Payment declined
          </h2>
          <p>You were not charged. Try UPI again or choose cash on delivery.</p>
          <button
            className="btn btn-p"
            onClick={() => {
              setResult(null);
              goTo(1);
            }}
          >
            Try another way
          </button>
        </div>
      )}
    </div>
  );
}