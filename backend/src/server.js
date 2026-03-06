const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

const SENTENCES = [
  "بٴگٸن كٴۇن جارقىن بولدى.",
  "قازاق تٴىلى ءبٸزدٸڭ انا تٴىلىمٸز.",
  "مەن بٴگٸن كٸتاپ وقىدىم.",
  "بٴٸز مەكتەپكە بارىپ وقيمىز.",
  "دوستارىمەن بىرگە ساباق وقيمىن.",
  "اتىم ايبەك.",
  "مەن قازاقستاندا تۇرامىن.",
  "بٴگٸن كٴۈن جىلى.",
  "اۋلا دا بالالار ويناپ جۇر.",
  "مەن قازاق تٴىلىن ءۇيرەنٸپ جۇرمن.",
  "مەن كۇن سايىن كٸتاپ وقيمىن.",
  "بالالار مەكتەپتە وقىپ جۇر.",
  "بٴگٸن ساباق قىزىقتى بولدى.",
  "اۋا رايى جاقسى.",
  "مەن جاقسى دوستار تاپتىم.",
  "بٴگٸن بٴٸز جاڭا سوزدەر ءۇيرەندٸك.",
  "قازاق تٴىلى وته باي تٴىل.",
  "اتىم مەن ٴاتام مەنٸ جاقسى كورەدٸ.",
  "بالالار كٴۇلٸپ ويناپ جۇر.",
  "بٴگٸن مەكتەپتە سايىس بولدى.",
  "مەن كۇن سايىن جازۋ جاتتىعۋىن جاسايمىن.",
  "قازاق تٴىلى ساباعى ماعان ءۇنايدى.",
  "بٴگٸن بالالار جاقسى وقىدى.",
  "دوستارىمەن سٴويلىسٸپ وتىرمىن.",
  "اۋلا دا بالالار ويناپ جۇر.",
  "بٴگٸن كٴۇن سۋىق بولدى.",
  "مەن جازۋدى جاتتىعىپ جۇرمن.",
  "قازاق تٴىلىن جاقسى كورەمٸن.",
  "مەن جاڭا سوزدەر ءۇيرەندٸم.",
  "بٴگٸن بٴٸز كٸتاپحاناعا باردىق.",
  "كٸتاپ وقۋ وته پايدالى.",
  "مەن كٸتاپتار وقۋدى جاكسى كورەمٸن.",
  "كٸتاپ وقۋ وته پايدالى.",
  "مەن كٸتاپتار وقۋدى جاكسى كورەمٸن.",
  "بالالار ساباققا دايىن.",
  "بٴگٸن ساباق تٴەز وتتى.",
  "دوستارىم مەنٸ كٴوتە جاقسى كورەدٸ.",
  "بٴگٸن مەن جاقسى كونىل كٴۇيدەمٸن.",
  "قازاق تٴىلى وته كوركەم تٴىل.",
  "مەن كۇن سايىن جاڭا نەرسە ءۇيرەنەمٸن.",
  "دوستارىمەن بىرگە جۇرگەن ءۇنايدى.",
  "بٴگٸن كٴۇن وته جاقسى وتتى.",
  "قازاق تٴىلى ءبٸزدٸڭ مادەني مۇرامىز.",
  "بٴگٸن بٴٸز جازۋ جاتتىعۋىن جاسادىق.",
  "مەن قازاق تٴىلىن ءۇيرەنۋدٸ جاكسى كورەمٸن.",
  "دوستارىمەن بٴٸرگە سٴويلەسەمٸن.",
  "بالالار مەكتەپتە وقىپ جۇر.",
  "بٴگٸن كٴۇن وته جارقىن بولدى.",
  "مەن كٴۇن سايىن جاتتىعۋ جاسايمىن.",
  "قازاق تٴىلىن ءۇيرەنۋ قىزىقتى.",
  "بٴگٸن ساباق وته قىزىقتى بولدى.",
  "مەن قازاق تٴىلىن ءۇيرەنٸپ جۇرمن.",
];

const WORDS = SENTENCES.flatMap((sentence) =>
  sentence
    .replace(/[.،؛«»؟!]/g, "")
    .split(/\s+/)
    .filter(Boolean),
);

app.use(cors());
app.use(express.json());

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function createWords(count) {
  return Array.from({ length: count }, () => WORDS[randomInt(WORDS.length)]).join(" ");
}

function createSentenceBlock(count) {
  return Array.from(
    { length: count },
    () => SENTENCES[randomInt(SENTENCES.length)],
  ).join(" ");
}

app.get("/", (req, res) => {
  res.send("ToteType API running");
});

app.get("/api/text", (req, res) => {
  const mode = req.query.mode === "sentences" ? "sentences" : "words";
  const countRaw = Number.parseInt(String(req.query.count || ""), 10);
  const count = Number.isNaN(countRaw) ? (mode === "words" ? 15 : 2) : countRaw;
  const safeCount = Math.min(Math.max(count, 1), mode === "words" ? 60 : 8);

  const text = mode === "words" ? createWords(safeCount) : createSentenceBlock(safeCount);

  res.json({
    mode,
    count: safeCount,
    text,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
