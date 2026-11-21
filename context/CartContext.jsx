/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

const CartContext = createContext(null);

// Custom cart hook
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

// Read saved data
function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Cart Provider
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => read("cart", {}));
  const [orders, setOrders] = useState(() => read("orders", []));

  // Save cart and orders
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Unable to save cart data:", error);
    }
  }, [cart, orders]);

  // Add product
  const add = useCallback((id) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }));
  }, []);

  // Increase or decrease quantity
  const change = useCallback((id, amount) => {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] || 0) + amount;

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  }, []);

  // Clear cart
  const clear = useCallback(() => {
    setCart({});
  }, []);

  // Place order
  const placeOrder = useCallback((order) => {
    const id =
      "IC" + Date.now().toString().slice(-8);

    setOrders((current) => [
      { ...order, id, status: 0 },
      ...current,
    ]);

    setCart({});

    return id;
  }, []);

  // Total cart items
  const count = useMemo(
    () =>
      Object.values(cart).reduce(
        (total, quantity) => total + quantity,
        0
      ),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      orders,
      count,
      add,
      change,
      clear,
      placeOrder,
    }),
    [cart, orders, count, add, change, clear, placeOrder]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}