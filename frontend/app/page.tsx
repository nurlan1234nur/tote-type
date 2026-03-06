"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Mode = "words" | "sentences";
type KeyboardLayer = "base" | "shift";
type Lang = "kz" | "en" | "mn";

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

const TRANSLATIONS: Record<
  Lang,
  {
    appTitle: string;
    languageLabel: string;
    modeWords: string;
    modeSentences: string;
    newText: string;
    lessons: string;
    wpm: string;
    accuracy: string;
    time: string;
    aboutTote: string;
    lessonsTitle: string;
    lessonsIntro: string;
    lessonsVideoHint: string;
    lessonsPoints: string[];
    lessonsSource: string;
    pdfView: string;
    youtubeChannel: string;
    youtubeCardTitle: string;
    youtubeCardSubtitle: string;
    youtubeAlt: string;
    targetText: string;
    loading: string;
    typeHere: string;
    typePlaceholder: string;
    exerciseComplete: string;
    keyboardLayout: string;
    base: string;
    shiftPreview: string;
    shiftOn: string;
    shiftOff: string;
    toteToCyrillic: string;
  }
> = {
  kz: {
    appTitle: "Қазақ төте жазу теру жаттығуы",
    languageLabel: "Тіл",
    modeWords: "Сөздер",
    modeSentences: "Сөйлемдер",
    newText: "Жаңа мәтін",
    lessons: "Төте жазу сабақтары",
    wpm: "WPM",
    accuracy: "Дәлдік",
    time: "Уақыт",
    aboutTote: "Төте жазу туралы",
    lessonsTitle: "ToteType сабақтары",
    lessonsIntro:
      "Қазақ төте жазу әліпбиі 1924 жылы араб жазуы негізінде жасалған. Әліпбиде 33 әріп бар, оның 9-ы дауысты дыбыс, қалғандары дауыссыз дыбыс. Дәйекше белгісінің қолданылуы да ерекше екені totejazwalippe.pdf материалында түсіндірілген.",
    lessonsVideoHint:
      "Төмендегі суретті бассаңыз, Adrian Mei (@ayszhang) YouTube арнасына тікелей өтесіз.",
    lessonsPoints: [
      "Төте жазу әліпбиі 1924 жылы араб графикасы негізінде жүйеленген.",
      "Қазіргі Қазақстанда негізінен кирилл қолданылады, ал Қытайдағы қазақтар төте жазуды әлі кең қолданады.",
      "Әліпбиде барлығы 33 әріп бар.",
      "9 дауысты дыбыс: а, ә, е, ы, і, о, ө, ұ, ү.",
      "У және и кей жағдайда дауысты, кей жағдайда дауыссыз қызмет атқарады.",
      "Дәйекше (ء) белгісі сөз басында қолданылады, кейбір әріптермен қатар келгенде жазылмайды деп түсіндіріледі.",
    ],
    lessonsSource: "Дереккөз: totejazwalippe.pdf (локал материал)",
    pdfView: "PDF көру",
    youtubeChannel: "YouTube арнасы",
    youtubeCardTitle: "Осы форматта үйрететін YouTube арнасы",
    youtubeCardSubtitle: "Adrian Mei - @ayszhang/videos",
    youtubeAlt: "Төте жазуды үйрететін YouTube арнасы",
    targetText: "Нысана мәтін",
    loading: "Жүктелуде...",
    typeHere: "Осы жерге теріңіз",
    typePlaceholder: "Мәтінді көшіріп жазыңыз...",
    exerciseComplete: "Жаттығу аяқталды. Жалғастыру үшін «Жаңа мәтін» батырмасын басыңыз.",
    keyboardLayout: "Пернетақта көрінісі",
    base: "Негізгі",
    shiftPreview: "Shift көрінісі",
    shiftOn: "Shift: Қосулы (нақты)",
    shiftOff: "Shift: Өшірулі",
    toteToCyrillic: "Төте - кирилл",
  },
  en: {
    appTitle: "Kazakh Tote Jazu Typing Practice",
    languageLabel: "Language",
    modeWords: "Words",
    modeSentences: "Sentences",
    newText: "New Text",
    lessons: "Tote Jazu Lessons",
    wpm: "WPM",
    accuracy: "Accuracy",
    time: "Time",
    aboutTote: "About Tote Jazu",
    lessonsTitle: "ToteType Lessons",
    lessonsIntro:
      "The Kazakh Tote writing alphabet was formalized in 1924 based on Arabic script. It has 33 letters, including 9 vowels, and uses a special diacritic marker in specific positions, as explained in the totejazwalippe.pdf material.",
    lessonsVideoHint:
      "Click the card below to go directly to Adrian Mei (@ayszhang) YouTube lessons.",
    lessonsPoints: [
      "The Tote writing alphabet was systematized in 1924 on the basis of Arabic script.",
      "Today, Kazakhstan mainly uses Cyrillic, while Kazakhs in China still widely use Tote writing.",
      "The alphabet contains 33 letters in total.",
      "There are 9 vowels: a, ae, e, y, i, o, oe, u, ue.",
      "The letters for 'u' and 'i' can function as vowels or consonants depending on context.",
      "The diacritic mark (ء) is used with specific positional rules, especially around word-initial forms.",
    ],
    lessonsSource: "Source: totejazwalippe.pdf (local material)",
    pdfView: "PDF View",
    youtubeChannel: "YouTube Channel",
    youtubeCardTitle: "A YouTube channel that teaches in this style",
    youtubeCardSubtitle: "Adrian Mei - @ayszhang/videos",
    youtubeAlt: "YouTube channel teaching Tote writing",
    targetText: "Target Text",
    loading: "Loading...",
    typeHere: "Type Here",
    typePlaceholder: "Type the text here...",
    exerciseComplete: "Exercise complete. Press New Text to continue.",
    keyboardLayout: "Keyboard Layout",
    base: "Base",
    shiftPreview: "Shift Preview",
    shiftOn: "Shift: ON (live)",
    shiftOff: "Shift: OFF",
    toteToCyrillic: "Tote to Cyrillic",
  },
  mn: {
    appTitle: "Казах төтэ бичгийн шивэлтийн дасгал",
    languageLabel: "Хэл",
    modeWords: "Үгс",
    modeSentences: "Өгүүлбэр",
    newText: "Шинэ текст",
    lessons: "Төтэ бичгийн хичээлүүд",
    wpm: "WPM",
    accuracy: "Нарийвчлал",
    time: "Хугацаа",
    aboutTote: "Төтэ бичгийн тухай",
    lessonsTitle: "ToteType хичээлүүд",
    lessonsIntro:
      "Казах төтэ бичгийн цагаан толгой нь 1924 онд араб бичигт тулгуурлан боловсруулагдсан. Нийт 33 үсэгтэй бөгөөд 9 нь эгшиг, бусад нь гийгүүлэгч байдаг. Дайекше тэмдгийн хэрэглээг totejazwalippe.pdf материалд тайлбарласан байна.",
    lessonsVideoHint:
      "Доорх зураг дээр дарвал Adrian Mei (@ayszhang)-ийн YouTube хичээлийн суваг руу шууд орно.",
    lessonsPoints: [
      "Төтэ бичгийн цагаан толгой 1924 онд араб бичигт тулгуурлан системчлогдсон.",
      "Өнөөгийн Казахстанд кирилл давамгай хэрэглэгддэг боловч Хятад дахь казахууд төтэ бичгийг өргөн хэрэглэсээр байна.",
      "Цагаан толгой нийт 33 үсэгтэй.",
      "9 эгшигтэй: а, ә, е, ы, і, о, ө, ұ, ү.",
      "У ба и үсэг нь нөхцлөөс хамааран эгшиг эсвэл гийгүүлэгчийн үүрэгтэй ордог.",
      "Дайекше (ء) тэмдэг нь үгийн байрлалаас хамаарсан дүрэмтэй гэж материалд тайлбарласан.",
    ],
    lessonsSource: "Эх сурвалж: totejazwalippe.pdf (локал материал)",
    pdfView: "PDF үзэх",
    youtubeChannel: "YouTube суваг",
    youtubeCardTitle: "Ингэж заадаг YouTube суваг",
    youtubeCardSubtitle: "Adrian Mei - @ayszhang/videos",
    youtubeAlt: "Төтэ бичиг заадаг YouTube суваг",
    targetText: "Зорилтот текст",
    loading: "Ачаалж байна...",
    typeHere: "Энд бичнэ үү",
    typePlaceholder: "Текстыг энд бичнэ үү...",
    exerciseComplete: "Дасгал дууслаа. Үргэлжлүүлэх бол «Шинэ текст» товчийг дарна уу.",
    keyboardLayout: "Гарын байрлал",
    base: "Үндсэн",
    shiftPreview: "Shift харагдац",
    shiftOn: "Shift: Асаалттай (амьд)",
    shiftOff: "Shift: Унтраалттай",
    toteToCyrillic: "Төтэ - кирилл",
  },
};

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
  const [lang, setLang] = useState<Lang>("kz");
  const [mode, setMode] = useState<Mode>("words");
  const [layerPreview, setLayerPreview] = useState<KeyboardLayer>("base");
  const [isShiftHeld, setIsShiftHeld] = useState(false);
  const [targetText, setTargetText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS[lang];

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
      <div className="fixed right-4 top-4 z-20 rounded-xl border border-[#d7c8a7] bg-surface px-3 py-2 shadow-[0_8px_18px_rgba(80,62,28,0.12)]">
        <label htmlFor="lang-select" className="mr-2 text-xs font-medium text-muted">
          {t.languageLabel}
        </label>
        <select
          id="lang-select"
          value={lang}
          onChange={(event) => setLang(event.target.value as Lang)}
          className="rounded-md border border-[#d5c49b] bg-white px-2 py-1 text-xs"
        >
          <option value="kz">Қазақ</option>
          <option value="en">English</option>
          <option value="mn">Монгол</option>
        </select>
      </div>
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">ToteType</p>
              <h1 className="mt-1 text-3xl font-semibold">{t.appTitle}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/lessons" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white">
                {t.lessons}
              </Link>
              <button
                type="button"
                onClick={() => setMode("words")}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  mode === "words" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                }`}
              >
                {t.modeWords}
              </button>
              <button
                type="button"
                onClick={() => setMode("sentences")}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  mode === "sentences" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                }`}
              >
                {t.modeSentences}
              </button>
              <button
                type="button"
                onClick={() => void loadExercise(mode)}
                className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-surface"
              >
                {t.newText}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs uppercase tracking-wide text-muted">{t.wpm}</p>
              <p className="mt-2 text-3xl font-semibold">{stats.wpm.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs uppercase tracking-wide text-muted">{t.accuracy}</p>
              <p className="mt-2 text-3xl font-semibold">{stats.accuracy.toFixed(1)}%</p>
            </div>
            <div className="rounded-2xl bg-surface-soft p-4">
              <p className="text-xs uppercase tracking-wide text-muted">{t.time}</p>
              <p className="mt-2 text-3xl font-semibold">{stats.elapsedSec.toFixed(1)}s</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#dbc9a2] bg-[#fff8e8] p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">{t.targetText}</p>
            <div dir="rtl" className="font-arabic text-right text-3xl leading-relaxed">
              {loading ? (
                <span className="text-muted">{t.loading}</span>
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
              {t.typeHere}
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
              placeholder={t.typePlaceholder}
            />
          </div>

          {completed && (
            <p className="mt-3 rounded-xl bg-[#d9f4e3] px-4 py-2 text-sm font-medium text-[#145a31]">
              {t.exerciseComplete}
            </p>
          )}

          <div className="mt-7 rounded-2xl border border-[#dbc9a2] bg-[#fffbef] p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-wide text-muted">{t.keyboardLayout}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLayerPreview("base")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    layerPreview === "base" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                  }`}
                >
                  {t.base}
                </button>
                <button
                  type="button"
                  onClick={() => setLayerPreview("shift")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    layerPreview === "shift" ? "bg-accent text-white" : "bg-surface-soft text-foreground"
                  }`}
                >
                  {t.shiftPreview}
                </button>
                <span className={`text-xs ${isShiftHeld ? "text-accent" : "text-muted"}`}>
                  {isShiftHeld ? t.shiftOn : t.shiftOff}
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
          <p className="text-xs uppercase tracking-wide text-muted">{t.toteToCyrillic}</p>
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
