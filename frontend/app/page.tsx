"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type Mode = "words" | "sentences";
type KeyboardLayer = "base" | "shift";

type Keycap = {
  key: string;
  latin: string;
  base?: string;
  shift?: string;
  width?: "normal" | "wide" | "xwide" | "space";
};

type KeyOutput = {
  base?: string;
  shift?: string;
};

const FALLBACK_WORDS = [
  "قازاق",
  "تٴىلى",
  "انا",
  "اتا",
  "ايا",
  "كىتاپ",
  "مەكتىپ",
  "سٸنىپ",
  "بالا",
  "ئۇستاز",
  "اۋىل",
  "قالا",
  "ەل",
  "دوس",
  "وتباسى",
  "مادەنيەت",
  "بىليم",
  "تابىعەت",
  "ارمان",
  "بىرلىك",
];

const FALLBACK_SENTENCES = [
  "قازاق تٴىلى ءبىزدىڭ ەڭ قۇندى مادەني مۇرامىز.",
  "تٴوتە جازۋعا كۇندەلىك جاتتىعۋ جىلدامدىق پەن دالدىقتى كوشەيتەدى.",
  "انا تٴىلدە كيتاپ وقۋ ءارىپتەر مەن سوزدەردى جاقسى ٴۇيرەتەدى.",
];

const LETTER_GUIDE = [
  { tote: "ا", cyr: "а" },
  { tote: "ب", cyr: "б" },
  { tote: "پ", cyr: "п" },
  { tote: "ت", cyr: "т" },
  { tote: "ج", cyr: "ж" },
  { tote: "چ", cyr: "ч" },
  { tote: "ح", cyr: "х" },
  { tote: "د", cyr: "д" },
  { tote: "ر", cyr: "р" },
  { tote: "ز", cyr: "з" },
  { tote: "س", cyr: "с" },
  { tote: "ش", cyr: "ш" },
  { tote: "ع", cyr: "ғ" },
  { tote: "ف", cyr: "ф" },
  { tote: "ق", cyr: "қ" },
  { tote: "ك", cyr: "к" },
  { tote: "گ", cyr: "г" },
  { tote: "ڭ", cyr: "ң" },
  { tote: "ل", cyr: "л" },
  { tote: "م", cyr: "м" },
  { tote: "ن", cyr: "н" },
  { tote: "ھ", cyr: "һ" },
  { tote: "و", cyr: "о/ө" },
  { tote: "ۇ", cyr: "ұ" },
  { tote: "ۆ", cyr: "ү" },
  { tote: "ۋ", cyr: "у" },
  { tote: "ى", cyr: "ы/і" },
  { tote: "ە", cyr: "е" },
  { tote: "ي", cyr: "й/и" },
];

const KEYBOARD: Keycap[][] = [
  [
    { key: "Tab", latin: "Tab", width: "wide" },
    { key: "KeyQ", latin: "Q", base: "غ", shift: "ٶ" },
    { key: "KeyW", latin: "W", base: "ۋ", shift: "ٷ" },
    { key: "KeyE", latin: "E", base: "ء", shift: "ٸ" },
    { key: "KeyR", latin: "R", base: "ر", shift: "ڕ" },
    { key: "KeyT", latin: "T", base: "ت", shift: "×" },
    { key: "KeyY", latin: "Y", base: "ي", shift: "÷" },
    { key: "KeyU", latin: "U", base: "ۇ", shift: "ۇٔ" },
    { key: "KeyI", latin: "I", base: "ڭ", shift: "ٸٔ" },
    { key: "KeyO", latin: "O", base: "و", shift: "ؤ" },
    { key: "KeyP", latin: "P", base: "پ", shift: "№" },
    { key: "BracketLeft", latin: "[", base: "«", shift: "]" },
    { key: "BracketRight", latin: "]", base: "»", shift: "[" },
    { key: "Backslash", latin: "\\", base: "|", shift: "\\" },
  ],
  [
    { key: "CapsLock", latin: "Caps", width: "xwide" },
    { key: "KeyA", latin: "A", base: "ھ", shift: "ٴ" },
    { key: "KeyS", latin: "S", base: "س", shift: "§" },
    { key: "KeyD", latin: "D", base: "د", shift: "©" },
    { key: "KeyF", latin: "F", base: "ا", shift: "ف" },
    { key: "KeyG", latin: "G", base: "ە", shift: "ك" },
    { key: "KeyH", latin: "H", base: "ى", shift: "ح" },
    { key: "KeyJ", latin: "J", base: "ق", shift: "ج" },
    { key: "KeyK", latin: "K", base: "ك", shift: "ۆ" },
    { key: "KeyL", latin: "L", base: "ل", shift: "لا" },
    { key: "Semicolon", latin: ";", base: ":", shift: ":" },
    { key: "Quote", latin: "'", base: "“", shift: "”" },
    { key: "Enter", latin: "Enter", width: "xwide" },
  ],
  [
    { key: "ShiftLeft", latin: "Shift", width: "xwide" },
    { key: "KeyZ", latin: "Z", base: "ز", shift: "①" },
    { key: "KeyX", latin: "X", base: "ش", shift: "②" },
    { key: "KeyC", latin: "C", base: "ع", shift: "③" },
    { key: "KeyV", latin: "V", base: "ۆ", shift: "④" },
    { key: "KeyB", latin: "B", base: "ب", shift: "…" },
    { key: "KeyN", latin: "N", base: "ن", shift: "،" },
    { key: "KeyM", latin: "M", base: "م", shift: "؛" },
    { key: "Comma", latin: ",", base: "،", shift: "‹" },
    { key: "Period", latin: ".", base: ".", shift: "›" },
    { key: "Slash", latin: "/", base: "/", shift: "؟" },
    { key: "ShiftRight", latin: "Shift", width: "xwide" },
  ],
  [
    { key: "CtrlLeft", latin: "Ctrl", width: "wide" },
    { key: "AltLeft", latin: "Alt", width: "wide" },
    { key: "Space", latin: "Space", base: " ", shift: " ", width: "space" },
    { key: "AltRight", latin: "Alt", width: "wide" },
    { key: "CtrlRight", latin: "Ctrl", width: "wide" },
  ],
];

const KEY_OUTPUT_MAP = KEYBOARD.flat().reduce<Record<string, KeyOutput>>((acc, item) => {
  if (item.base || item.shift) {
    acc[item.key] = { base: item.base, shift: item.shift };
  }
  return acc;
}, {});

function randomFrom<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function fallbackText(mode: Mode) {
  if (mode === "words") {
    return Array.from({ length: 15 }, () => randomFrom(FALLBACK_WORDS)).join(" ");
  }
  return Array.from({ length: 2 }, () => randomFrom(FALLBACK_SENTENCES)).join(" ");
}

function keycapWidthClass(width: Keycap["width"]) {
  if (width === "wide") return "keycap-wide";
  if (width === "xwide") return "keycap-xwide";
  if (width === "space") return "keycap-space";
  return "";
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("words");
  const [layerPreview, setLayerPreview] = useState<KeyboardLayer>("base");
  const [isShiftHeld, setIsShiftHeld] = useState(false);
  const [showLessons, setShowLessons] = useState(false);
  const [targetText, setTargetText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(true);

  const keyboardLayer: KeyboardLayer = isShiftHeld ? "shift" : layerPreview;
  const currentChar = targetText[typedText.length] || "";
  const typeFromCode = useCallback((code: string, shiftPressed: boolean) => {
    const output = KEY_OUTPUT_MAP[code];
    if (!output) return null;
    return shiftPressed ? output.shift || output.base || null : output.base || null;
  }, []);
  const appendTyped = useCallback(
    (char: string) => {
      if (!startedAt) setStartedAt(Date.now());
      setTypedText((prev) => prev + char);
    },
    [startedAt],
  );

  const loadExercise = useCallback(async (nextMode: Mode) => {
    setLoading(true);
    try {
      const count = nextMode === "words" ? 15 : 2;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const response = await fetch(
        `${apiBaseUrl}/api/text?mode=${nextMode}&count=${count}`,
      );
      if (!response.ok) {
        throw new Error("Failed to load text");
      }
      const data = (await response.json()) as { text?: string };
      setTargetText(data.text || fallbackText(nextMode));
    } catch {
      setTargetText(fallbackText(nextMode));
    } finally {
      setTypedText("");
      setStartedAt(null);
      setEndedAt(null);
      setNow(Date.now());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExercise(mode);
  }, [loadExercise, mode]);

  useEffect(() => {
    if (!startedAt || endedAt) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [startedAt, endedAt]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") setIsShiftHeld(true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") setIsShiftHeld(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const completed = typedText === targetText && targetText.length > 0;

  useEffect(() => {
    if (completed && !endedAt) {
      setEndedAt(Date.now());
    }
  }, [completed, endedAt]);

  const stats = useMemo(() => {
    const typedChars = typedText.length;
    let correctChars = 0;
    for (let i = 0; i < typedChars; i += 1) {
      if (typedText[i] === targetText[i]) correctChars += 1;
    }

    const accuracy = typedChars > 0 ? (correctChars / typedChars) * 100 : 100;
    const elapsedSec = startedAt ? ((endedAt || now) - startedAt) / 1000 : 0;
    const wpm = elapsedSec > 0 ? (correctChars / 5 / elapsedSec) * 60 : 0;
    return { elapsedSec, accuracy, wpm };
  }, [typedText, targetText, startedAt, endedAt, now]);

  return (
    <main className="paper-bg min-h-screen px-4 py-10 text-foreground md:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-[#d7c8a7] bg-surface p-5 shadow-[0_12px_30px_rgba(80,62,28,0.11)] lg:grid-cols-[minmax(0,1fr)_280px] md:p-8">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">ToteType</p>
              <h1 className="mt-1 text-3xl font-semibold">Kazakh Tote Jazu Typing Practice</h1>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("words")}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  mode === "words" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                }`}
              >
                Words
              </button>
              <button
                type="button"
                onClick={() => setMode("sentences")}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  mode === "sentences" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                }`}
              >
                Sentences
              </button>
              <button
                type="button"
                onClick={() => void loadExercise(mode)}
                className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-surface"
              >
                New Text
              </button>
              <button
                type="button"
                onClick={() => setShowLessons((prev) => !prev)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  showLessons ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                }`}
              >
                Tote Jazu Lessons
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs uppercase tracking-wide text-muted">WPM</p>
              <p className="mt-2 text-3xl font-semibold">{stats.wpm.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Accuracy</p>
              <p className="mt-2 text-3xl font-semibold">{stats.accuracy.toFixed(1)}%</p>
            </div>
            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Time</p>
              <p className="mt-2 text-3xl font-semibold">{stats.elapsedSec.toFixed(1)}s</p>
            </div>
          </div>

          {showLessons && (
            <div className="mt-6 rounded-2xl border border-[#dbc9a2] bg-[#fff9ea] p-5">
              <p className="text-xs uppercase tracking-wide text-muted">About Tote Jazu</p>
              <h2 className="mt-2 text-2xl font-semibold">ToteType Hicheeluud</h2>
              <p className="mt-3 text-sm leading-7 text-[#4b3b1e]">
                Tote jazw alipbisi ni 1924 ond arab bicgiin undes deer tusgaarlan zohioson kazak alin nigen
                bicgiin helber yum. Ene alipbid niit 33 usegtei, 9 ni egshig avias, busad ni gyigyylegch avias
                buguud dayekshe temdeg ashigladag onclogtoi gej `totejazwalippe.pdf` deer tailbarlasan baina.
              </p>
              <p className="mt-2 text-sm leading-7 text-[#4b3b1e]">
                Doorh card deer darahad Tote jazw zaadag Adrian Mei (`@ayszhang`) YouTube suvag ruu shuud ochno.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/totejazwalippe.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-surface"
                >
                  PDF View
                </a>
                <a
                  href="https://www.youtube.com/@ayszhang/videos"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
                >
                  YouTube Channel
                </a>
              </div>
              <a
                href="https://www.youtube.com/@ayszhang/videos"
                target="_blank"
                rel="noreferrer"
                className="mt-5 block overflow-hidden rounded-2xl border border-[#d6c59d] bg-[#fffdf6] shadow-[0_8px_24px_rgba(80,62,28,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(80,62,28,0.2)]"
              >
                <Image
                  src="/TOTE-TYPE.png"
                  alt="Tote jazw zaadag hunii YouTube suvag"
                  width={1200}
                  height={675}
                  className="h-auto w-full"
                  priority={false}
                />
                <div className="p-4">
                  <p className="text-sm font-semibold">Iim ingej zaadag hunii YouTube suvag</p>
                  <p className="mt-1 text-xs text-muted">Adrian Mei - @ayszhang/videos</p>
                </div>
              </a>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-[#dbc9a2] bg-[#fff8e8] p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Target Text</p>
            <div dir="rtl" className="font-arabic text-right text-3xl leading-relaxed">
              {loading ? (
                <span className="text-muted">Loading...</span>
              ) : (
                targetText.split("").map((char, index) => {
                  let className = "char";
                  if (index < typedText.length) {
                    className += typedText[index] === char ? " correct" : " incorrect";
                  } else if (index === typedText.length) {
                    className += " current";
                  }
                  return (
                    <span key={`${char}-${index}`} className={className}>
                      {char}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="typing" className="mb-2 block text-xs uppercase tracking-wide text-muted">
              Type Here
            </label>
            <textarea
              id="typing"
              dir="rtl"
              className="font-arabic h-36 w-full resize-none rounded-2xl border border-[#d9c79e] bg-white p-4 text-right text-2xl outline-none focus:border-accent"
              value={typedText}
              readOnly
              disabled={loading}
              onKeyDown={(event) => {
                if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
                  setIsShiftHeld(true);
                  return;
                }

                if (event.code === "Backspace") {
                  event.preventDefault();
                  setTypedText((prev) => prev.slice(0, -1));
                  return;
                }

                const mapped = typeFromCode(event.code, event.shiftKey);
                if (mapped !== null) {
                  event.preventDefault();
                  appendTyped(mapped);
                }
              }}
              onKeyUp={(event) => {
                if (event.code === "ShiftLeft" || event.code === "ShiftRight") setIsShiftHeld(false);
              }}
              placeholder="ماتىندى كوشىرٸپ جازىڭىز..."
            />
          </div>

          {completed && (
            <p className="mt-3 rounded-xl bg-[#d9f4e3] px-4 py-2 text-sm font-medium text-[#145a31]">
              Exercise complete. Press New Text to continue.
            </p>
          )}

          <div className="mt-7 rounded-2xl border border-[#dbc9a2] bg-[#fffbef] p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-wide text-muted">Keyboard Layout</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLayerPreview("base")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    layerPreview === "base" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                  }`}
                >
                  Base
                </button>
                <button
                  type="button"
                  onClick={() => setLayerPreview("shift")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    layerPreview === "shift" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                  }`}
                >
                  Shift Preview
                </button>
                <span className={`text-xs ${isShiftHeld ? "text-accent" : "text-muted"}`}>
                  {isShiftHeld ? "Shift: ON (live)" : "Shift: OFF"}
                </span>
              </div>
            </div>
            <div className="keyboard-shell space-y-2 overflow-hidden rounded-xl border border-[#dbc9a2] bg-[#f7f0de] p-3">
              {KEYBOARD.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="keyboard-row flex w-full gap-2">
                  {row.map((item) => {
                    const shown = keyboardLayer === "shift" ? item.shift || item.base : item.base;
                    const isActiveChar = shown && currentChar === shown;
                    const isShiftKey = item.key === "ShiftLeft" || item.key === "ShiftRight";
                    const active = Boolean(isActiveChar || (isShiftKey && isShiftHeld));
                    return (
                      <button
                        type="button"
                        key={item.key}
                        disabled={loading}
                        onClick={() => {
                          if (isShiftKey) {
                            setLayerPreview((prev) => (prev === "base" ? "shift" : "base"));
                            return;
                          }
                          const mapped = typeFromCode(item.key, keyboardLayer === "shift");
                          if (mapped !== null) appendTyped(mapped);
                        }}
                        className={`keycap ${keycapWidthClass(item.width)} ${active ? "active" : ""}`}
                      >
                        <span className="keycap-latin">{item.latin}</span>
                        <span className="font-arabic keycap-tote">{shown || ""}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-[#dbc9a2] bg-[#fffbef] p-4 lg:sticky lg:top-8 lg:h-fit">
          <p className="text-xs uppercase tracking-wide text-muted">Tote to Cyrillic</p>
          <div className="mt-3 max-h-[68vh] overflow-auto pr-1">
            {LETTER_GUIDE.map((item) => (
              <div
                key={item.tote}
                className="flex items-center justify-between border-b border-[#ead9b3] py-2 text-sm last:border-0"
              >
                <span className="font-arabic text-2xl">{item.tote}</span>
                <span className="text-muted">-</span>
                <span className="font-medium">{item.cyr}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
