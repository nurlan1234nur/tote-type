import { NextResponse } from "next/server";

const WORDS = [
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
  "جۇرەك",
  "دوس",
  "وتباسى",
  "ەڭبەك",
  "دانالىق",
  "ونەر",
  "مادەنيەت",
  "بىليم",
  "تارىح",
  "تابىعەت",
  "ارمان",
  "ارىپ",
  "سوز",
  "ويل",
  "حالىق",
  "ادىل",
  "بىرلىك",
  "جىلدام",
  "دال",
  "جاقسى",
];

const SENTENCES = [
  "قازاق تٴىلى ءبىزدىڭ ەڭ قۇندى مادەني مۇرامىز.",
  "تٴوتە جازۋعا كۇندەلىك جاتتىعۋ جىلدامدىق پەن دالدىقتى كوشەيتەدى.",
  "انا تٴىلدە كيتاپ وقۋ ءارىپتەر مەن سوزدەردى جاقسى ٴۇيرەتەدى.",
  "بىگىن مەكتەپتە قازاق تٴىلى ساباعى قىزىقتى وتتى.",
  "وتباسىدا بىرگە ماتىن جازۋ بالاعا سەنٸم بەرەدى.",
  "تازا جازۋ ءۇشٸن اەربىر سوزدى بايقاپ قايتالاپ جازىڭىز.",
];

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function createWords(count: number) {
  return Array.from({ length: count }, () => WORDS[randomInt(WORDS.length)]).join(" ");
}

function createSentenceBlock(count: number) {
  return Array.from({ length: count }, () => SENTENCES[randomInt(SENTENCES.length)]).join(" ");
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "sentences" ? "sentences" : "words";
  const countRaw = Number.parseInt(searchParams.get("count") || "", 10);
  const count = Number.isNaN(countRaw) ? (mode === "words" ? 15 : 2) : countRaw;
  const safeCount = Math.min(Math.max(count, 1), mode === "words" ? 60 : 8);

  const text = mode === "words" ? createWords(safeCount) : createSentenceBlock(safeCount);

  return NextResponse.json({
    mode,
    count: safeCount,
    text,
  });
}
