import { Link } from "react-router-dom";
import { useLists } from "../context/ListsContext";
import { usePrefs } from "../context/AccessibilityContext";
import { products } from "../data/products";
import { ATTR, fit } from "../lib/accessfit";

export default function Compare() {
  const { compare, toggleCompare, clearCompare } = useLists();
  const { prefs, announce } = usePrefs();
  const items = products.filter((p) => compare.includes(p.id));

  if (items.length < 2) {
    return (
      <div>
        <h1>Compare</h1>
        <div className="card">
          Choose at least 2 products to compare. Press <b>Compare</b> on a product in the{" "}
          <Link to="/shop">Shop</Link>.
          {items.length === 1 && " You have picked 1 so far."}
        </div>
      </div>
    );
  }

  const results = items.map((p) => fit(p, prefs.needs));
  const best = Math.max(...results.map((r) => r.score ?? -1));
  const cell = {
    padding: "10px 12px",
    borderBottom: "1px solid var(--bd)",
    textAlign: "left",
    verticalAlign: "top",
  };

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Compare</h1>
      <p className="mut">
        Scores use your Passport settings. Unverified information is never counted.{" "}
        <span className="badge sim">Sample data</span>
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
          <caption className="sr-only">Product comparison</caption>
          <thead>
            <tr>
              <th scope="col" style={cell}>Feature</th>
              {items.map((p) => (
                <th scope="col" key={p.id} style={cell}>
                  {p.emoji} {p.name}
                  <div>
                    <button
                      className="btn"
                      style={{ marginTop: 6 }}
                      onClick={() => {
                        toggleCompare(p.id);
                        announce(p.name + " removed from compare");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" style={cell}>Price</th>
              {items.map((p) => (
                <td key={p.id} style={cell}>₹{p.price}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" style={cell}>Match score</th>
              {results.map((r, i) => (
                <td key={items[i].id} style={cell}>
                  {r.score === null ? (
                    <span className="unk">Information not verified</span>
                  ) : (
                    <b>{r.score}%</b>
                  )}
                  {r.score !== null && r.score === best && (
                    <span className="badge ok"> Best match</span>
                  )}
                </td>
              ))}
            </tr>
            {Object.keys(ATTR).map((k) => (
              <tr key={k}>
                <th scope="row" style={cell}>{ATTR[k]}</th>
                {items.map((p) => {
                  const v = p.a[k];
                  return (
                    <td key={p.id} style={cell}>
                      {v === undefined ? (
                        <span className="unk">? Not verified</span>
                      ) : v ? (
                        <span className="ok">✓ Yes</span>
                      ) : (
                        <span className="no">✕ No</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 16 }}>
        <button className="btn" onClick={clearCompare}>Clear comparison</button>
      </p>
    </div>
  );
}