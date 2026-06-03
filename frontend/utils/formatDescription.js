export function formatDescription(text) {
  if (!text || typeof text !== 'string') return text;

  let formatted = text
    // normalize ellipsis and keep three dots
    .replace(/\.{2,}/g, '...')
    // ensure space after punctuation when missing
    .replace(/([,;:!?])(?!\s)/g, '$1 ')
    // ensure a space after periods when missing and not part of ellipsis
    .replace(/\.(?!\.)(?!\s)/g, '. ')
    // remove extra spaces around punctuation
    .replace(/\s*([,;:!?\.])\s*/g, '$1 ')
    // remove duplicate spaces
    .replace(/\s{2,}/g, ' ')
    // remove space before closing punctuation
    .replace(/\s+([,;!?\.])/g, '$1')
    .trim();

  return formatted;
}
