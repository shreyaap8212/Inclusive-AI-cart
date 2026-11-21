import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductDialog from "../components/ProductDialog";
import { usePrefs } from "../context/AccessibilityContext";
import { products } from "../data/products";
import { NEEDS, fit } from "../lib/accessfit";
import { listen } from "../lib/voice";

export default function Shop() {
  const { prefs, announce } = usePrefs();
  const [params] = useSearchParams();

  const [q, setQ] = useState(() => params.get("q") || "");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("fit");
  const [openId, setOpenId] = useState(null);

  const list = products
    .filter(
      (p) =>
        (cat === "all" || p.cat === cat) &&
        p.name.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "lo") return a.price - b.price;
      if (sort === "hi") return b.price - a.price;

      return (
        (fit(b, prefs.needs).score ?? -1) -
        (fit(a, prefs.needs).score ?? -1)
      );
    });

  const needNames = prefs.needs
    .map((n) => NEEDS[n][0])
    .join(", ");

  function voiceSearch() {
    listen(
      (text) => {
        setQ(text);
        announce("Searching for " + text);
      },
      (msg) => announce(msg)
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Shop</h1>

      <p className="mut">
        Matching for:{" "}
        <b>{needNames || "no accessibility needs selected"}</b>.{" "}
        <Link to="/passport">Change in Passport</Link>
      </p>

      <div className="row" style={{ margin: "14px 0" }}>
        <input
          className="field"
          type="search"
          aria-label="Search products"
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />

        <button className="btn" onClick={voiceSearch}>
          🎤 Voice search
        </button>

        <select
          className="field"
          aria-label="Category"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="all">All categories</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Appliances">Appliances</option>
        </select>

        <select
          className="field"
          aria-label="Sort by"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="fit">Best match</option>
          <option value="lo">Price: low to high</option>
          <option value="hi">Price: high to low</option>
        </select>
      </div>

      <p className="mut">
        Sample products and sample accessibility data.{" "}
        <span className="badge sim">Simulated</span>
      </p>

      {list.length === 0 ? (
        <div className="card">
          No products match. Clear the search or choose all categories.
        </div>
      ) : (
        <div className="grid">
          {list.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={setOpenId}
            />
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