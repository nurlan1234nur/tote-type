# ToteType — Project Overview

## Нэг өгүүлбэрээр

ToteType нь Казах Төте жазу үсгээр бичих дадлага, WPM болон accuracy хэмжилт, keyboard visualization бүхий сургалтын платформ юм.

## Хөгжүүлсэн арга

Бүтээгдэхүүний шаардлага болон сургалтын үндсэн interaction-ыг би тодорхойлж, AI-assisted байдлаар frontend/backend prototype хөгжүүлсэн. Implementation-ийг ажиллуулж, өөрчилж, typing metric болон API урсгалыг судалсан.

## Бүтэц

- `frontend/` — Next.js typing interface
- `backend/` — random practice text өгөх Node.js API
- Reference зураг болон Төте жазу материалууд

## Гол ойлголтууд

- Input event-ээс elapsed time, зөв тэмдэг, нийт тэмдэг тооцох
- `WPM = (typed characters / 5) / elapsed minutes`
- Accuracy-г зөв оруулсан тэмдэг / нийт оролдлогоор тооцох
- Unicode тэмдэг болон custom keyboard mapping
- Frontend state ба backend-generated exercise-ийн зааг

## Миний сурсан зүйл

- Бодит цагийн хэмжилтийг UI state-тэй зөв уялдуулах
- Тусгай бичгийн системийн Unicode болон font асуудал
- Сургалтын feedback-ийг ойлгомжтой визуал болгох
- Жижиг frontend/backend системийн API contract

## Сайжруулах дараалал

1. WPM/accuracy тооцоололд unit test нэмэх.
2. Exercise difficulty болон хэрэглэгчийн progress хадгалах.
3. Keyboard mapping, font, browser compatibility-г баталгаажуулах.
4. Accessibility болон mobile typing experience-г сайжруулах.

## Portfolio-д хэрэглэх тодорхойлолт

> Шаардлагаа өөрөө тодорхойлж, AI-assisted байдлаар хөгжүүлсэн Төте жазу typing platform. Энэ төслөөр real-time input metrics, Unicode text, educational UX болон API integration-г судалсан.

