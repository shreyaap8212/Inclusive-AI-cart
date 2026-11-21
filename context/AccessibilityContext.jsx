import React, { createContext, useContext, useState } from "react";

const AccessibilityContext = createContext(null);

const defaultPrefs = {
  open: false,
  grip: false,
  print: false,
  tactile: false,
  audio: false,
  alert: false,
  simple: false,
};

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(defaultPrefs);

  const updatePref = (key, value) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPrefs = () => {
    setPrefs(defaultPrefs);
  };

  return (
    <AccessibilityContext.Provider
      value={{ prefs, setPrefs, updatePref, resetPrefs }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function usePrefs() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "usePrefs must be used inside AccessibilityProvider"
    );
  }

  return context;
}