import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>
);
