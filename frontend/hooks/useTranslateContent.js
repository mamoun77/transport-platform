import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const cache = {};

async function translateText(text, targetLang) {
  if (!text || targetLang === 'fr') return text;
  const key = `${targetLang}:${text}`;
  if (cache[key]) return cache[key];
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText || text;
    // Ignorer si MyMemory retourne un message d'erreur
    if (translated.includes('MYMEMORY WARNING') || translated.includes('NEXT AVAILABLE')) {
      cache[key] = text;
      return text;
    }
    cache[key] = translated;
    return translated;
  } catch {
    return text;
  }
}

export function useTranslateContent(items) {
  return items || [];
}
