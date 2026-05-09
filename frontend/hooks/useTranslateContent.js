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
    cache[key] = translated;
    return translated;
  } catch {
    return text;
  }
}

export function useTranslateContent(items, fields = ['name', 'short_description', 'description']) {
  const { locale } = useRouter();
  const [translated, setTranslated] = useState(items);
  const prevLocale = useRef(locale);

  useEffect(() => {
    if (!items || items.length === 0) { setTranslated(items); return; }
    if (locale === 'fr') { setTranslated(items); return; }

    let cancelled = false;
    async function run() {
      const result = await Promise.all(
        items.map(async (item) => {
          const updates = {};
          await Promise.all(
            fields.map(async (field) => {
              if (item[field]) updates[field] = await translateText(item[field], locale);
            })
          );
          return { ...item, ...updates };
        })
      );
      if (!cancelled) setTranslated(result);
    }
    run();
    return () => { cancelled = true; };
  }, [items, locale]);

  return translated;
}
