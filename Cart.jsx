import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

export default function Cart() {
  const { cart, change } = useCart();
  const items = products
    .filter((p) => cart[p.id])
    .map((p) => ({ ...p, q: cart[p.id] }));
  const total = items.reduce((a, i) => a + i.price * i.q, 0);

  if (items.length === 0) {
    return (
      <div>
        <h1>Cart</h1>
        <div className="card">
          Your cart is empty. <Link to="/shop">Find a product</Link>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Cart</h1>
      {items.map((i) => (
        <div
          key={i.id}
          className="card row"
          style={{ marginBottom: 12, justifyContent: "space-between" }}
        >
          <div>
            <h3 style={{ margin: 0 }}>{i.name}</h3>
            <span className="mut">₹{i.price} each</span>
          </div>
          <div className="row">
            <button
              className="btn"
              aria-label={"Fewer " + i.name}
              onClick={() => change(i.id, -1)}
            >
              −
            </button>
            <b aria-live="polite">{i.q}</b>
            <button
              className="btn"
              aria-label={"More " + i.name}
              onClick={() => change(i.id, 1)}
            >
              +
            </button>
            <button className="btn" onClick={() => change(i.id, -i.q)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>Total ₹{total}</p>
      <Link className="btn btn-p" to="/checkout">
        Continue to BlindPay
      </Link>
    </div>
  );
}
