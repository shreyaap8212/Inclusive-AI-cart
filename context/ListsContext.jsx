/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const ListsContext = createContext(null);

// Custom hook
export function useLists() {
  const context = useContext(ListsContext);

  if (!context) {
    throw new Error("useLists must be used inside ListsProvider");
  }

  return context;
}

// Read saved data
function read(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Lists Provider
export function ListsProvider({ children }) {
  const [wish, setWish] = useState(() => read("wish"));
  const [compare, setCompare] = useState(() => read("compare"));

  // Save wishlist and comparison list
  useEffect(() => {
    try {
      localStorage.setItem("wish", JSON.stringify(wish));
      localStorage.setItem("compare", JSON.stringify(compare));
    } catch (error) {
      console.error("Unable to save lists:", error);
    }
  }, [wish, compare]);

  // Add or remove wishlist products
  const toggleWish = useCallback((id) => {
    setWish((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }, []);

  // Add or remove comparison products
  const toggleCompare = useCallback((id) => {
    let success = true;

    setCompare((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 3) {
        success = false;
        return current;
      }

      return [...current, id];
    });

    return success;
  }, []);

  // Clear comparison list
  const clearCompare = useCallback(() => {
    setCompare([]);
  }, []);

  const value = useMemo(
    () => ({
      wish,
      compare,
      toggleWish,
      toggleCompare,
      clearCompare,
    }),
    [wish, compare, toggleWish, toggleCompare, clearCompare]
  );

  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
}
