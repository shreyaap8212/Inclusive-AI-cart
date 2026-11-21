import { useEffect, useRef, useState } from "react";
import { usePrefs } from "../context/AccessibilityContext";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import { ATTR, fit } from "../lib/accessfit";
import { speak } from "../lib/voice";

export default function ProductDialog({ product, onClose, onSelect }) {
  const ref = useRef(null);
  const { prefs, announce } = usePrefs();
  const { add } = useCart();
  const [large, setLarge] = useState(false);

  // open or close the native dialog when a product is chosen or cleared
  useEffect(() => {
    const d = ref.current;
    if (product && d && !d.open) d.showModal();
    if (!product && d && d.open) d.close();
  }, [product]);

  if (!product) return <dialog ref={ref} />;

  const f = fit(product, prefs.needs);
  const better = products.filter(
    (p) =>
      p.id !== product.id &&
      p.cat === product.cat &&
      (fit(p, prefs.needs).score ?? -1) > (f.score ?? -1)
  );

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="dlg-title">
      <h2 id="dlg-title" style={{ marginTop: 0 }}>
        {product.name}
      </h2>
      <p>
        ₹{product.price} ·{" "}
        {f.score === null ? (
          <span className="unk">Information not verified</span>
        ) : (
          <b>{f.score}% match</b>
        )}
      </p>

      <h3>Why this score</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.keys(ATTR).map((k) => {
          const v = product.a[k];
          return (
            <li key={k}>
              {v === undefined ? (
                <span className="unk">? Information not verified</span>
              ) : v ? (
                <span className="ok">✓ Yes</span>
              ) : (
                <span className="no">✕ No</span>
              )}
              {" · "}
              {ATTR[k]}
            </li>
          );
        })}
      </ul>
      <p className="mut">
        Evidence: {f.total - f.unknown.length} of {f.total} checks verified.
        Source: sample demo data. <span className="badge sim">Simulated</span>
      </p>

      <h3>Try before you buy: Accessibility Preview</h3>
      <p style={{ fontSize: large ? "1.6rem" : "1rem" }}>{product.label}</p>
      <div className="row">
        <button
          className="btn"
          onClick={() => speak(product.name + ". " + product.label)}
        >
          🔊 Read label aloud
        </button>
        <button
          className="btn"
          aria-pressed={large}
          onClick={() => setLarge(!large)}
        >
          Enlarge instructions
        </button>
      </div>

      <h3>Better matches</h3>
      {better.length === 0 ? (
        <p className="mut">No better-matching alternative in this category.</p>
      ) : (
        better.map((b) => (
          <p key={b.id}>
            {b.name}: {fit(b, prefs.needs).score}% match{" "}
            <button className="btn" onClick={() => onSelect(b.id)}>
              View
            </button>
          </p>
        ))
      )}

      <div className="row" style={{ marginTop: 16 }}>
        <button
          className="btn btn-p"
          onClick={() => {
            add(product.id);
            announce(product.name + " added to cart");
          }}
        >
          Add to cart
        </button>
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </dialog>
  );
}