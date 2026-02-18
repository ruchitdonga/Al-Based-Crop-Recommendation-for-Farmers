import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiPost } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

export default function VoiceChat() {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState(() => [
    {
      id: "m1",
      role: "ai",
      text: t("voice.greeting"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);
  const nextIdRef = useRef(2);
  const recognitionRef = useRef(null);
  const lastVoiceFinalRef = useRef("");

  const SpeechRecognitionCtor = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  const canRecognize = Boolean(SpeechRecognitionCtor);
  const canSpeak = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.speechSynthesis) && typeof window.SpeechSynthesisUtterance === "function";
  }, []);

  const locale = useMemo(() => {
    switch (lang) {
      case "hi":
        return "hi-IN";
      case "mr":
        return "mr-IN";
      case "gu":
        return "gu-IN";
      case "en":
      default:
        return "en-US";
    }
  }, [lang]);

  const appendMessage = (role, text) => {
    const id = `m${nextIdRef.current++}`;
    setMessages((prev) => [...prev, { id, role, text }]);
  };

  const speakText = (text) => {
    if (!canSpeak) return;

    try {
      window.speechSynthesis.cancel();
    } catch {
      // no-op
    }

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      // no-op
    }
  };

  const sendUserMessage = async (text) => {
    const cleaned = (text ?? "").toString().trim();
    if (!cleaned) return;

    setError("");
    appendMessage("user", cleaned);
    setInput("");

    setIsLoading(true);
    try {
      const res = await apiPost("/chat/", { message: cleaned, lang });
      if (!res.ok) {
        const msg = res?.data?.error || t("voice.aiUnavailable");
        setError(msg);
        appendMessage("ai", msg);
        speakText(msg);
        return;
      }

      const reply = res?.data?.reply || "";
      if (!reply) {
        const msg = t("voice.aiUnavailable");
        setError(msg);
        appendMessage("ai", msg);
        speakText(msg);
        return;
      }

      appendMessage("ai", reply);
      speakText(reply);
    } catch {
      const msg = t("voice.aiUnavailable");
      setError(msg);
      appendMessage("ai", msg);
      speakText(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        // no-op
      }
    }
    setIsListening(false);
  };

  const startListening = () => {
    setError("");

    if (!canRecognize) {
      setError(t("voice.unsupported"));
      return;
    }

    // Cancel any ongoing speech so voice feels responsive.
    if (canSpeak) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // no-op
      }
      setIsSpeaking(false);
    }

    lastVoiceFinalRef.current = "";

    const rec = new SpeechRecognitionCtor();
    recognitionRef.current = rec;

    rec.continuous = false; // auto-stop when user stops speaking
    rec.interimResults = true;
    rec.lang = locale;

    rec.onstart = () => {
      setIsListening(true);
      setError("");
    };

    rec.onerror = (event) => {
      const msg = event?.error
        ? `Speech recognition error: ${event.error}`
        : "Speech recognition error.";
      setError(msg);
      setIsListening(false);
    };

    rec.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }

      const combined = `${lastVoiceFinalRef.current} ${finalText} ${interim}`
        .replace(/\s+/g, " ")
        .trim();

      // Keep the input field live-updated.
      setInput(combined);

      if (finalText.trim()) {
        lastVoiceFinalRef.current = `${lastVoiceFinalRef.current} ${finalText}`
          .replace(/\s+/g, " ")
          .trim();
      }
    };

    rec.onspeechend = () => {
      try {
        rec.stop();
      } catch {
        // no-op
      }
    };

    rec.onend = () => {
      setIsListening(false);

      const finalSpoken = (lastVoiceFinalRef.current || input).trim();
      lastVoiceFinalRef.current = "";
      recognitionRef.current = null;

      if (finalSpoken) {
        sendUserMessage(finalSpoken);
      }
    };

    try {
      rec.start();
    } catch {
      setError(t("voice.micPermission"));
      setIsListening(false);
    }
  };

  const onMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isListening) stopListening();
    if (!isLoading) sendUserMessage(input);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // no-op
      }

      try {
        window.speechSynthesis?.cancel?.();
      } catch {
        // no-op
      }
    };
  }, []);

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>{t("voice.title")}</div>
            <div style={styles.subtitle}>
              {isListening
                ? t("voice.listening")
                : isSpeaking
                  ? t("voice.speaking")
                  : isLoading
                    ? t("form.loading")
                    : t("voice.ready")}
            </div>
          </div>
          <div style={styles.badges}>
            <span style={styles.badge}>{canRecognize ? "STT" : "STT off"}</span>
            <span style={styles.badge}>{canSpeak ? "TTS" : "TTS off"}</span>
          </div>
        </div>

        <div ref={listRef} style={styles.list} role="log" aria-live="polite">
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                ...styles.row,
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                className="vc-bubble"
                style={{
                  ...styles.bubble,
                  ...(m.role === "user" ? styles.userBubble : styles.aiBubble),
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}

        <form onSubmit={onSubmit} style={styles.composer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("voice.placeholder")}
            style={styles.input}
            aria-label="Message"
          />

          <button
            type="button"
            onClick={onMicClick}
            className={`vc-mic ${isListening ? "vc-mic--listening" : ""}`}
            style={{
              ...styles.iconButton,
              ...(!canRecognize ? styles.iconButtonDisabled : null),
            }}
            disabled={!canRecognize}
            aria-pressed={isListening}
            aria-label={isListening ? t("voice.micStop") : t("voice.micStart")}
            title={!canRecognize ? "Speech recognition requires Chrome" : undefined}
          >
            {isListening ? "■" : "🎤"}
          </button>

          <button type="submit" style={styles.sendButton} aria-label={t("voice.send")} disabled={isLoading}>
            {t("voice.send")}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "radial-gradient(1200px 600px at 20% 0%, rgba(120,120,255,0.12), transparent 60%), #0b0f17",
    color: "rgba(255,255,255,0.92)",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 860,
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(10px)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(255,255,255,0.68)",
  },
  badges: {
    display: "flex",
    gap: 8,
  },
  badge: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.75)",
  },
  list: {
    height: "60vh",
    maxHeight: 520,
    overflowY: "auto",
    padding: 16,
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    marginBottom: 10,
  },
  bubble: {
    maxWidth: "80%",
    padding: "10px 12px",
    borderRadius: 16,
    lineHeight: 1.35,
    fontSize: 14,
    border: "1px solid rgba(255,255,255,0.10)",
  },
  userBubble: {
    background: "rgba(120,120,255,0.18)",
  },
  aiBubble: {
    background: "rgba(255,255,255,0.06)",
  },
  error: {
    padding: "10px 16px",
    color: "#ffb4b4",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,0,0,0.06)",
  },
  composer: {
    display: "flex",
    gap: 10,
    padding: 16,
    borderTop: "1px solid rgba(255,255,255,0.10)",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.20)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
  },
  iconButton: {
    height: 44,
    minWidth: 46,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.20)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontSize: 18,
    position: "relative",
    transition: "background 220ms ease, border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease",
  },
  iconButtonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  sendButton: {
    height: 44,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
};

const css = `
  .vc-bubble {
    animation: vc-pop 180ms ease-out;
    transform-origin: 50% 100%;
  }

  .vc-mic {
    isolation: isolate;
  }

  .vc-mic--listening {
    border-color: rgba(34, 197, 94, 0.38) !important;
    background: rgba(255,255,255,0.10) !important;
    animation: vc-mic-glow 1.1s ease-in-out infinite;
  }

  .vc-mic--listening::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 14px;
    border: 1px solid rgba(34, 197, 94, 0.42);
    z-index: -1;
    animation: vc-mic-pulse 1.1s ease-out infinite;
  }

  @keyframes vc-mic-glow {
    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0), 0 0 0 0 rgba(34, 197, 94, 0.0); transform: translateY(0); }
    50% { box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14), 0 14px 28px rgba(0,0,0,0.28); transform: translateY(-1px); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0), 0 0 0 0 rgba(34, 197, 94, 0.0); transform: translateY(0); }
  }

  @keyframes vc-mic-pulse {
    0% { transform: scale(0.96); opacity: 0.75; }
    70% { transform: scale(1.12); opacity: 0.0; }
    100% { transform: scale(1.12); opacity: 0.0; }
  }

  @keyframes vc-pop {
    from { transform: translateY(4px) scale(0.98); opacity: 0.0; }
    to { transform: translateY(0) scale(1); opacity: 1.0; }
  }
`;
