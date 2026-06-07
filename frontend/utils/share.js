export async function shareItem({ title = '', text = '', url = '' } = {}) {
  if (typeof window === 'undefined') return false;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return true;
    }
    // fallback: copy link to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url || window.location.href);
      // simple feedback
      alert('Link copied to clipboard');
      return true;
    }
    // last resort: prompt
    window.prompt('Copy this link:', url || window.location.href);
    return true;
  } catch (err) {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      alert('Link copied to clipboard');
      return true;
    } catch (e) {
      alert('Unable to share this item');
      return false;
    }
  }
}

export default shareItem;
