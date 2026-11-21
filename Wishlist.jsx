import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductDialog from "../components/ProductDialog";
import { useLists } from "../context/ListsContext";
import { products } from "../data/products";

export default function Wishlist() {
  const { wish } = useLists();
  const [openId, setOpenId] = useState(null);
  const items = products.filter((p) => wish.includes(p.id));

  return (
    <div>
      <h1>Wishlist</h1>
      {items.length === 0 ? (
        <div className="card">
          Nothing saved yet. Press <b>Save</b> on a product in the <Link to="/shop">Shop</Link>.
        </div>
      ) : (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={setOpenId} />
          ))}
        </div>
      )}
      <ProductDialog
        product={products.find((p) => p.id === openId) || null}
        onClose={() => setOpenId(null)}
        onSelect={setOpenId}
      />
    </div>
  );
}