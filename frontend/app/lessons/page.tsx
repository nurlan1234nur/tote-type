"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Lang = "kz" | "en" | "mn";

const TRANSLATIONS: Record<
  Lang,
  {
    appTitle: string;
    languageLabel: string;
    backLabel: string;
    aboutTote: string;
    lessonsTitle: string;
    lessonsIntro: string;
    lessonsPoints: string[];
    lessonsSource: string;
    lessonsVideoHint: string;
    pdfView: string;
    youtubeChannel: string;
    youtubeCardTitle: string;
    youtubeCardSubtitle: string;
    youtubeAlt: string;
  }
> = {
  kz: {
    appTitle: "Қазақ төте жазу сабақтары",
    languageLabel: "Тіл",
    backLabel: "Қайту",
    aboutTote: "Төте жазу туралы",
    lessonsTitle: "ToteType сабақтары",
    lessonsIntro:
      "Қазақ төте жазу әліпбиі 1924 жылы араб жазуы негізінде жасалған. Әліпбиде 33 әріп бар, оның 9-ы дауысты дыбыс, қалғандары дауыссыз дыбыс.",
    lessonsPoints: [
      "Төте жазу әліпбиі 1924 жылы араб графикасы негізінде жүйеленген.",
      "Қазіргі Қазақстанда негізінен кирилл қолданылады, ал Қытайдағы қазақтар төте жазуды әлі кең қолданады.",
      "Әліпбиде барлығы 33 әріп бар.",
      "9 дауысты дыбыс: а, ә, е, ы, і, о, ө, ұ, ү.",
      "У және и кей жағдайда дауысты, кей жағдайда дауыссыз қызмет атқарады.",
      "Дәйекше (ء) белгісі сөз басында қолданылады, кейбір әріптермен қатар келгенде жазылмайды деп түсіндіріледі.",
    ],
    lessonsSource: "Дереккөз: totejazwalippe.pdf (локал материал)",
    lessonsVideoHint: "Төмендегі суретті бассаңыз, Adrian Mei (@ayszhang) YouTube арнасына тікелей өтесіз.",
    pdfView: "PDF көру",
    youtubeChannel: "YouTube арнасы",
    youtubeCardTitle: "Осы форматта үйрететін YouTube арнасы",
    youtubeCardSubtitle: "Adrian Mei - @ayszhang/videos",
    youtubeAlt: "Төте жазуды үйрететін YouTube арнасы",
  },
  en: {
    appTitle: "Kazakh Tote Jazu Lessons",
    languageLabel: "Language",
    backLabel: "Back",
    aboutTote: "About Tote Jazu",
    lessonsTitle: "ToteType Lessons",
    lessonsIntro:
      "The Kazakh Tote writing alphabet was formalized in 1924 based on Arabic script. It has 33 letters, including 9 vowels.",
    lessonsPoints: [
      "The Tote writing alphabet was systematized in 1924 on the basis of Arabic script.",
      "Today, Kazakhstan mainly uses Cyrillic, while Kazakhs in China still widely use Tote writing.",
      "The alphabet contains 33 letters in total.",
      "There are 9 vowels: a, ae, e, y, i, o, oe, u, ue.",
      "The letters for 'u' and 'i' can function as vowels or consonants depending on context.",
      "The diacritic mark (ء) is used with specific positional rules, especially around word-initial forms.",
    ],
    lessonsSource: "Source: totejazwalippe.pdf (local material)",
    lessonsVideoHint: "Click the card below to go directly to Adrian Mei (@ayszhang) YouTube lessons.",
    pdfView: "PDF View",
    youtubeChannel: "YouTube Channel",
    youtubeCardTitle: "A YouTube channel that teaches in this style",
    youtubeCardSubtitle: "Adrian Mei - @ayszhang/videos",
    youtubeAlt: "YouTube channel teaching Tote writing",
  },
  mn: {
    appTitle: "Казах төтэ бичгийн хичээл",
    languageLabel: "Хэл",
    backLabel: "Буцах",
    aboutTote: "Төтэ бичгийн тухай",
    lessonsTitle: "ToteType хичээлүүд",
    lessonsIntro:
      "Казах төтэ бичгийн цагаан толгой нь 1924 онд араб бичигт тулгуурлан боловсруулагдсан. Нийт 33 үсэгтэй бөгөөд 9 нь эгшиг байна.",
    lessonsPoints: [
      "Төтэ бичгийн цагаан толгой 1924 онд араб бичигт тулгуурлан системчлогдсон.",
      "Өнөөгийн Казахстанд кирилл давамгай хэрэглэгддэг боловч Хятад дахь казахууд төтэ бичгийг өргөн хэрэглэсээр байна.",
      "Цагаан толгой нийт 33 үсэгтэй.",
      "9 эгшигтэй: а, ә, е, ы, і, о, ө, ұ, ү.",
      "У ба и үсэг нь нөхцлөөс хамааран эгшиг эсвэл гийгүүлэгчийн үүрэгтэй ордог.",
      "Дайекше (ء) тэмдэг нь үгийн байрлалаас хамаарсан дүрэмтэй гэж материалд тайлбарласан.",
    ],
    lessonsSource: "Эх сурвалж: totejazwalippe.pdf (локал материал)",
    lessonsVideoHint: "Доорх зураг дээр дарвал Adrian Mei (@ayszhang)-ийн YouTube хичээлийн суваг руу шууд орно.",
    pdfView: "PDF үзэх",
    youtubeChannel: "YouTube суваг",
    youtubeCardTitle: "Ингэж заадаг YouTube суваг",
    youtubeCardSubtitle: "Adrian Mei - @ayszhang/videos",
    youtubeAlt: "Төтэ бичиг заадаг YouTube суваг",
  },
};

export default function LessonsPage() {
  const [lang, setLang] = useState<Lang>("kz");
  const t = TRANSLATIONS[lang];

  return (
    <main className="paper-bg min-h-screen px-4 py-10 text-foreground md:px-8">
      <div className="fixed right-4 top-4 z-20">
        <select
          id="lang-select"
          value={lang}
          onChange={(event) => setLang(event.target.value as Lang)}
          className="rounded-md bg-surface-soft px-2 py-1 text-xs shadow-[0_6px_14px_rgba(80,62,28,0.14)] outline-none"
        >
          <option value="kz">Қазақ</option>
          <option value="en">English</option>
          <option value="mn">Монгол</option>
        </select>
      </div>

      <section className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">ToteType</p>
            <h1 className="mt-1 text-3xl font-semibold">{t.appTitle}</h1>
          </div>
          <Link href="/" className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-surface">
            {t.backLabel}
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-[#dbc9a2] bg-[#fff9ea] p-5">
          <p className="text-xs uppercase tracking-wide text-muted">{t.aboutTote}</p>
          <h2 className="mt-2 text-2xl font-semibold">{t.lessonsTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-[#4b3b1e]">{t.lessonsIntro}</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#4b3b1e]">
            {t.lessonsPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{t.lessonsSource}</p>
          <p className="mt-2 text-sm leading-7 text-[#4b3b1e]">{t.lessonsVideoHint}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/totejazwalippe.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-surface"
            >
              {t.pdfView}
            </a>
            <a
              href="https://www.youtube.com/@ayszhang/videos"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
            >
              {t.youtubeChannel}
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
              alt={t.youtubeAlt}
              width={1200}
              height={675}
              className="h-auto w-full"
              priority={false}
            />
            <div className="p-4">
              <p className="text-sm font-semibold">{t.youtubeCardTitle}</p>
              <p className="mt-1 text-xs text-muted">{t.youtubeCardSubtitle}</p>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
