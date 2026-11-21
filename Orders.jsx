import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const STAGES = ["Order placed", "Packed", "Out for delivery", "Delivered"];

export default function Orders() {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div>
        <h1>Orders</h1>
        <div className="card">
          No orders yet. <Link to="/shop">Start shopping</Link>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Orders</h1>
      {orders.map((o) => (
        <div key={o.id} className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>
            {o.id}: ₹{o.total} ({o.method})
          </h3>
          <p className="mut">{o.items}</p>
          <ol>
            {STAGES.map((s, i) => (
              <li key={s} className={i <= o.status ? "" : "mut"}>
                {i <= o.status ? "✓ " : ""}
                {s}
              </li>
            ))}
          </ol>
          <span className="badge sim">Tracking simulated</span>
        </div>
      ))}
    </div>
  );
}