// Reads text aloud using the browser's built-in speech
export function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN";
  window.speechSynthesis.speak(u);
}

// Listens once using the browser's speech recognition (Chrome and Edge)
export function listen(onText, onFail) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onFail("Voice is not supported in this browser. Please type instead.");
    return;
  }
  const rec = new SR();
  rec.lang = "en-IN";
  rec.onresult = (e) => onText(e.results[0][0].transcript.toLowerCase());
  rec.onerror = () => onFail("I did not catch that. Please try again or type.");
  rec.start();
}