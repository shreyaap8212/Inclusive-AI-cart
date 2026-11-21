// Labels shown to the user
export const ATTR = {
  open: "Easy to open",
  grip: "Needs little grip strength",
  print: "Large-print label",
  tactile: "Tactile markings",
  audio: "Audio or voice guide",
  alert: "Visual or vibration alerts",
  simple: "Simple setup",
};

// Which attributes matter for each need
export const NEEDS = {
  visual: ["Visual", "print", "tactile", "audio"],
  hearing: ["Hearing", "alert"],
  mobility: ["Mobility", "open", "grip", "simple"],
  cognitive: ["Cognitive", "simple", "print"],
};

// How much each attribute counts towards the score
const WEIGHT = { open: 3, grip: 3, print: 3, tactile: 3, audio: 2, alert: 3, simple: 2 };

// AccessFit 360: only verified attributes count. Unknown ones are never invented.
export function fit(product, needs) {
  const chosen = needs.length ? needs : Object.keys(NEEDS);
  const keys = [...new Set(chosen.flatMap((n) => NEEDS[n].slice(1)))];
  let got = 0;
  let max = 0;
  const pos = [];
  const neg = [];
  const unknown = [];

  keys.forEach((k) => {
    const v = product.a[k];
    if (v === undefined || v === null) {
      unknown.push(k);
    } else {
      max += WEIGHT[k];
      if (v) {
        got += WEIGHT[k];
        pos.push(k);
      } else {
        neg.push(k);
      }
    }
  });

  return {
    score: max ? Math.round((got / max) * 100) : null, // null = Information not verified
    pos,
    neg,
    unknown,
    total: keys.length,
  };
}