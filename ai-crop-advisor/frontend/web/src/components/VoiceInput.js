import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * VoiceInput (Chrome)
 * - Uses the Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * - Click mic to start listening; auto-stops when user stops speaking
 * - Writes recognized text into an input field
 */
export default function VoiceInput({
  value,
  onChange,
  placeholder = "Speak or type…",
  disabled = false,
}) {
  const [text, setText] = useState(value ?? "");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const baseTextRef = useRef("");
  const finalTranscriptRef = useRef("");
  const inputTextRef = useRef("");

  const recognitionRef = useRef(null);

  const SpeechRecognitionCtor = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  const isSupported = Boolean(SpeechRecognitionCtor);

  // Keep internal state in sync if parent controls `value`.
  useEffect(() => {
    if (typeof value === "string" && value !== text) {
      setText(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    inputTextRef.current = text;
  }, [text]);

  const emitChange = (next) => {
    setText(next);
    if (typeof onChange === "function") onChange(next);
  };

  const userFriendlyError = (code) => {
    switch (code) {
      case "not-allowed":
      case "service-not-allowed":
        return "Microphone permission was denied. Allow mic access in Chrome site settings and try again.";
      case "no-speech":
        return "No speech detected. Try speaking a bit louder or closer to the microphone.";
      case "audio-capture":
        return "No microphone was found or it is busy. Check your audio device settings.";
      case "network":
        return "Speech recognition network error. Check your internet connection and try again.";
      case "aborted":
        return "Voice input was stopped.";
      default:
        return code ? `Speech recognition error: ${code}` : "Speech recognition error.";
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        // abort() stops immediately; stop() tries to return a final result.
        if (typeof rec.abort === "function") rec.abort();
        else rec.stop();
      } catch {
        // no-op
      }
    }
    setIsListening(false);
  };

  const startListening = () => {
    setError("");

    if (!isSupported) {
      setError("Voice input is not supported in this browser. Please use Chrome (desktop)." );
      return;
    }

    if (disabled) return;

    // Create a fresh instance each time to avoid weird state issues across starts.
    const rec = new SpeechRecognitionCtor();
    recognitionRef.current = rec;

    baseTextRef.current = String(inputTextRef.current ?? "").trim();
    finalTranscriptRef.current = "";

    // Config: stop automatically when the user stops speaking.
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
      setError("");
    };

    rec.onerror = (event) => {
      setError(userFriendlyError(event?.error));
      setIsListening(false);
    };

    rec.onnomatch = () => {
      setError("I couldn’t recognize that. Try again.");
    };

    rec.onresult = (event) => {
      // Build text as: base + final + interim (no duplication).
      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) {
          finalChunk += transcript;
        } else {
          interim += transcript;
        }
      }

      if (finalChunk.trim()) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalChunk}`.replace(/\s+/g, " ").trim();
      }

      const base = baseTextRef.current;
      const combined = `${base} ${finalTranscriptRef.current} ${interim}`.replace(/\s+/g, " ").trim();
      emitChange(combined);
    };

    // When user stops speaking, Chrome fires `speechend` then `end`.
    rec.onspeechend = () => {
      try {
        rec.stop();
      } catch {
        // no-op
      }
    };

    rec.onend = () => {
      setIsListening(false);

      const base = baseTextRef.current;
      const finalText = `${base} ${finalTranscriptRef.current}`.replace(/\s+/g, " ").trim();
      if (finalTranscriptRef.current.trim()) {
        emitChange(finalText);
      }

      // If we ended without a transcript and without an error, show a gentle hint.
      if (!finalTranscriptRef.current.trim() && !error) {
        setError("No speech detected. Tap the mic and try again.");
      }

      baseTextRef.current = "";
      finalTranscriptRef.current = "";
      recognitionRef.current = null;
    };

    try {
      rec.start();
    } catch (e) {
      setError("Unable to start voice input. Please try again.");
      setIsListening(false);
    }
  };

  const onMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      const rec = recognitionRef.current;
      if (rec) {
        try {
          rec.onstart = null;
          rec.onresult = null;
          rec.onerror = null;
          rec.onnomatch = null;
          rec.onend = null;
          rec.onspeechend = null;
          if (typeof rec.abort === "function") rec.abort();
          else rec.stop();
        } catch {
          // no-op
        }
      }
      recognitionRef.current = null;
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.row}>
        <input
          type="text"
          value={text}
          onChange={(e) => emitChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            ...styles.input,
            ...(disabled ? styles.inputDisabled : null),
          }}
          aria-label="Voice input text"
        />

        <button
          type="button"
          onClick={onMicClick}
          disabled={disabled || !isSupported}
          style={{
            ...styles.micButton,
            ...(isListening ? styles.micButtonActive : null),
            ...(disabled || !isSupported ? styles.micButtonDisabled : null),
          }}
          aria-pressed={isListening}
          aria-label={isListening ? "Stop listening" : "Start listening"}
          title={!isSupported ? "Voice input requires Chrome" : undefined}
        >
          {isListening ? "■" : "🎤"}
        </button>
      </div>

      <div style={styles.metaRow}>
        <div style={styles.status} aria-live="polite">
          {isListening ? "Listening…" : ""}
        </div>
        <div style={styles.hint}>
          {!isSupported ? "Web Speech API not available." : ""}
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
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    outline: "none",
    fontSize: 16,
    background: "#fff",
  },
  inputDisabled: {
    background: "rgba(0,0,0,0.03)",
  },
  micButton: {
    height: 44,
    minWidth: 48,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "#fff",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "44px",
  },
  micButtonActive: {
    border: "1px solid rgba(0,0,0,0.35)",
    background: "rgba(0,0,0,0.06)",
  },
  micButtonDisabled: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    minHeight: 18,
  },
  status: {
    fontSize: 13,
    color: "rgba(0,0,0,0.75)",
  },
  hint: {
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
  },
  error: {
    marginTop: 8,
    fontSize: 13,
    color: "#b00020",
  },
};
