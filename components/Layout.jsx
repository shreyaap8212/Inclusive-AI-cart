import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { usePrefs } from "../context/AccessibilityContext";
import { useCart } from "../context/CartContext";

export default function Layout() {
  const { message } = usePrefs();
  const { count } = useCart();
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  // move focus to the new page so screen reader users are not left behind
  useEffect(() => {
    if (mainRef.current) mainRef.current.focus();
  }, [pathname]);

  const links = [
    ["/shop", "Shop"],
    ["/passport", "Passport"],
    ["/compare", "Compare"],
    ["/wishlist", "Wishlist"],
    ["/cart", "Cart (" + count + ")"],
    ["/orders", "Orders"],
    ["/delivery", "Delivery"],
    ["/companion", "Companion"],
    ["/support", "More"],
  ];

  function linkStyle({ isActive }) {
    return {
      display: "inline-flex",
      alignItems: "center",
      minHeight: "var(--t)",
      padding: "0 14px",
      borderRadius: 12,
      border: "1px solid var(--bd)",
      fontWeight: 700,
      textDecoration: "none",
      background: isActive ? "var(--pri)" : "var(--card)",
      color: isActive ? "var(--on)" : "var(--fg)",
    };
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "var(--card)",
          borderBottom: "1px solid var(--bd)",
        }}
      >
        <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>InclusiCart</span>
        <nav
          aria-label="Main"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} style={linkStyle}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "24px 20px 90px",
          outline: "none",
        }}
      >
        <Outlet />
      </main>

      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
    </>
  );
}