import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * VoiceOutput (Chrome)
 * - Uses the browser SpeechSynthesis API
 * - Speak: cancels any existing speech, then speaks the latest text
 * - Stop: cancels and clears speaking state
 */
export default function VoiceOutput({
  text,
  disabled = false,
  lang = "en-US",
  rate = 1,
  pitch = 1,
  volume = 1,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");

  const utteranceRef = useRef(null);

  const isSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.speechSynthesis) && typeof window.SpeechSynthesisUtterance === "function";
  }, []);

  const stop = () => {
    setError("");

    if (!isSupported) return;

    try {
      window.speechSynthesis.cancel();
    } catch {
      // no-op
    }

    utteranceRef.current = null;
    setIsSpeaking(false);
  };

  const speak = () => {
    setError("");

    if (!isSupported) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }

    if (disabled) return;

    const cleanedText = (text ?? "").toString().trim();
    if (!cleanedText) {
      setError("Nothing to speak.");
      return;
    }

    // Handle multiple clicks properly:
    // - Cancel anything currently speaking (or queued)
    // - Speak the latest string immediately
    try {
      window.speechSynthesis.cancel();
    } catch {
      // no-op
    }

    const utterance = new window.SpeechSynthesisUtterance(cleanedText);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      const msg = e?.error ? `Speech synthesis error: ${e.error}` : "Speech synthesis error.";
      setError(msg);
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      setError("Unable to start speech. Please try again.");
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  };

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel?.();
      } catch {
        // no-op
      }
      utteranceRef.current = null;
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.row}>
        <button
          type="button"
          onClick={speak}
          disabled={disabled || !isSupported}
          style={{
            ...styles.button,
            ...(disabled || !isSupported ? styles.buttonDisabled : null),
          }}
          aria-label="Speak"
          title={!isSupported ? "SpeechSynthesis not available" : undefined}
        >
          Speak
        </button>

        <button
          type="button"
          onClick={stop}
          disabled={disabled || !isSupported || !isSpeaking}
          style={{
            ...styles.button,
            ...styles.stopButton,
            ...(disabled || !isSupported || !isSpeaking ? styles.buttonDisabled : null),
          }}
          aria-label="Stop speaking"
        >
          Stop
        </button>

        <div style={styles.status} aria-live="polite">
          {isSpeaking ? "Speaking…" : ""}
        </div>
      </div>

      {error ? <div style={styles.error}>{error}</div> : null}
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: 720,
    margin: "0 auto",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  button: {
    height: 40,
    padding: "0 14px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  stopButton: {
    background: "rgba(0,0,0,0.04)",
  },
  buttonDisabled: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  status: {
    fontSize: 13,
    color: "rgba(0,0,0,0.7)",
    minWidth: 90,
  },
  error: {
    marginTop: 8,
    fontSize: 13,
    color: "#b00020",
  },
};
