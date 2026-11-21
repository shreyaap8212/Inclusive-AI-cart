import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrefs } from "./AccessibilityContext";
import { useCart } from "./CartContext";
import { listen, speak } from "../lib/voice";

// A short beep tells blind users when the microphone starts and stops
function beep(freq) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 120);
  } catch {
    /* audio unavailable */
  }
}

export function VoiceProvider({ children }) {
  const navigate = useNavigate();
  const { prefs, set, announce } = usePrefs();
  const { count } = useCart();
  const [listening, setListening] = useState(false);

  const say = useCallback(
    (text) => {
      announce(text); // screen reader live region
      speak(text); // spoken aloud, because the user chose voice
    },
    [announce]
  );

  function handle(text) {
    const m = text.match(/(?:search|find|show me|show)(?: for)? (.+)/);
    if (m) {
      navigate("/shop?q=" + encodeURIComponent(m[1]));
      say("Showing results for " + m[1]);
    } else if (/read.*cart|what.*cart/.test(text)) {
      say("Your cart has " + count + (count === 1 ? " item." : " items."));
    } else if (/cart/.test(text)) {
      navigate("/cart");
      say("Cart. You have " + count + (count === 1 ? " item." : " items."));
    } else if (/checkout|pay/.test(text)) {
      navigate("/checkout");
      say("Checkout. Review your order before paying.");
    } else if (/passport|settings/.test(text)) {
      navigate("/passport");
      say("Accessibility Passport.");
    } else if (/order|track/.test(text)) {
      navigate("/orders");
      say("Your orders.");
    } else if (/delivery/.test(text)) {
      navigate("/delivery");
      say("Delivery Passport.");
    } else if (/companion|trusted|help me/.test(text)) {
      navigate("/companion");
      say("Trusted Companion.");
    } else if (/shop|home|products/.test(text)) {
      navigate("/shop");
      say("Shop.");
    } else if (/high contrast/.test(text)) {
      set({ hc: true });
      say("High contrast on.");
    } else if (/larger|bigger|increase text/.test(text)) {
      set({ text: Math.min(1.5, prefs.text + 0.25) });
      say("Text made larger.");
    } else if (/smaller|decrease text/.test(text)) {
      set({ text: Math.max(1, prefs.text - 0.25) });
      say("Text made smaller.");
    } else if (/help|what can i say/.test(text)) {
      say(
        "You can say: search kettle, cart, read my cart, checkout, passport, orders, delivery, companion, high contrast, or larger text."
      );
    } else {
      say("I heard " + text + ". Say help to hear what you can say.");
    }
  }

  function talk() {
    if (listening) return;
    window.speechSynthesis && window.speechSynthesis.cancel();
    beep(880);
    setListening(true);
    listen(
      (text) => {
        setListening(false);
        beep(520);
        handle(text);
      },
      (msg) => {
        setListening(false);
        say(msg);
      }
    );
  }

  // press V anywhere (outside text boxes) to talk
  useEffect(() => {
    function onKey(e) {
      const tag = e.target.tagName;
      if (/INPUT|TEXTAREA|SELECT/.test(tag) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.toLowerCase() === "v") talk();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      {children}
      <button
        onClick={talk}
        aria-label="Talk to InclusiCart. Shortcut: V"
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 16,
          zIndex: 20,
          minHeight: 56,
          padding: "0 26px",
          borderRadius: 99,
          border: 0,
          background: "var(--tea)",
          color: "var(--on)",
          font: "inherit",
          fontWeight: 700,
          fontSize: "1.05rem",
          cursor: "pointer",
          boxShadow: "0 6px 24px rgba(0,0,0,.35)",
        }}
      >
        {listening ? "🎙️ Listening…" : "🎤 Talk (V)"}
      </button>
    </>
  );
}