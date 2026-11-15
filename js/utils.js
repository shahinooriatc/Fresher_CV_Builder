// Small shared helpers. No app logic here.

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// localStorage that never throws (private mode, full quota).
export const ls = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
};

// Third-party libraries are loaded only when they are needed.
export const CDN = {
  supabase: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  html2canvas: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  jspdf: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
};

const scripts = new Map();
export function loadScript(src) {
  if (!scripts.has(src)) {
    scripts.set(src, new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = () => { scripts.delete(src); reject(new Error('script-load-failed')); };
      document.head.append(el);
    }));
  }
  return scripts.get(src);
}

// Reads an image file and returns a small centre-cropped JPEG data URL (4:5 portrait).
export function fileToPhoto(file, width = 400, height = 500) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.max(width / img.width, height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad-image')); };
    img.src = url;
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
