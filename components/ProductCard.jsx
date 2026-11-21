import { usePrefs } from "../context/AccessibilityContext";
import { useCart } from "../context/CartContext";
import { useLists } from "../context/ListsContext";
import { fit } from "../lib/accessfit";

export default function ProductCard({ product, onOpen }) {
  const { prefs, announce } = usePrefs();
  const { add } = useCart();
  const { wish, compare, toggleWish, toggleCompare } = useLists();
  const f = fit(product, prefs.needs);
  const desc = prefs.calm ? product.desc.split(".")[0] + "." : product.desc;
  const wished = wish.includes(product.id);
  const comparing = compare.includes(product.id);

  function onCompare() {
    const ok = toggleCompare(product.id);
    if (!ok) announce("You can compare up to 3 products. Remove one first.");
    else announce(comparing ? "Removed from compare" : "Added to compare");
  }

  return (
    <article className="card">
      <div className="deco" style={{ fontSize: "2.4rem" }} aria-hidden="true">
        {product.emoji}
      </div>
      <h3 style={{ margin: "4px 0" }}>{product.name}</h3>
      <p className="mut" style={{ margin: "0 0 8px" }}>
        {desc}
      </p>
      <div className="row">
        <b>₹{product.price}</b>
        <span className="badge">{product.cat}</span>
      </div>

      {f.score === null ? (
        <p className="unk" style={{ margin: "10px 0" }}>
          Information not verified
        </p>
      ) : (
        <div style={{ margin: "10px 0" }}>
          <b style={{ fontSize: "1.3rem" }}>{f.score}% match</b>
          <div className="bar" role="img" aria-label={f.score + " percent match"}>
            <b style={{ width: f.score + "%" }} />
          </div>
        </div>
      )}

      <div className="row">
        <button className="btn" onClick={() => onOpen(product.id)}>
          Details
        </button>
        <button
          className="btn btn-p"
          aria-label={"Add " + product.name + " to cart"}
          onClick={() => {
            add(product.id);
            announce(product.name + " added to cart");
          }}
        >
          Add
        </button>
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <button
          className="btn"
          aria-pressed={wished}
          aria-label={
            (wished ? "Remove " : "Save ") +
            product.name +
            (wished ? " from wishlist" : " to wishlist")
          }
          onClick={() => {
            toggleWish(product.id);
            announce(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
        >
          {wished ? "♥ Saved" : "♡ Save"}
        </button>
        <button
          className="btn"
          aria-pressed={comparing}
          aria-label={(comparing ? "Remove " : "Compare ") + product.name}
          onClick={onCompare}
        >
          {comparing ? "✓ Comparing" : "Compare"}
        </button>
      </div>
    </article>
  );
}