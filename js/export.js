// Downloads: PDF (A4, multi-page), PNG image, standalone HTML, and print.
import { CONFIG } from './config.js';
import { CDN, downloadBlob, esc, loadScript } from './utils.js';
import { getTemplate } from './templates/index.js';
import { buildView } from './templates/helpers.js';

const W = 794;      // A4 width in CSS px
const H = 1123;     // A4 height in CSS px
const TOP = 40;     // top margin on continued pages
const BOTTOM = 28;  // bottom margin on every page

// Renders the CV off-screen at full size and photographs it.
// Also measures the blocks that must not be cut by a page break.
async function capture(html) {
  await loadScript(CDN.html2canvas);
  const host = document.createElement('div');
  host.className = 'export-host';
  host.innerHTML = html;
  document.body.append(host);
  try {
    const el = host.firstElementChild;
    const top = el.getBoundingClientRect().top;
    const box = (node) => { const r = node.getBoundingClientRect(); return [r.top - top, r.bottom - top]; };
    const blocks = [...el.querySelectorAll('.cv-item, .cv-head')].map(box);
    // A heading stays with the first block under it.
    for (const sec of el.querySelectorAll('.cv-sec')) {
      const first = sec.querySelector('.cv-item');
      blocks.push([box(sec.querySelector('.cv-h'))[0], box(first || sec)[1]]);
    }
    const canvas = await window.html2canvas(el, { scale: CONFIG.exportScale, backgroundColor: '#ffffff', logging: false });
    return { canvas, blocks, height: el.offsetHeight };
  } finally {
    host.remove();
  }
}

// Splits the tall sheet into A4 pages, breaking only between blocks.
function paginate(blocks, height) {
  const end = Math.min(height, Math.max(0, ...blocks.map((b) => b[1])) + BOTTOM);
  if (end <= H) return [[0, Math.min(height, H)]];

  const tops = [...new Set(blocks.map((b) => Math.floor(b[0])))].sort((a, b) => a - b);
  const isSafe = (y) => !blocks.some(([t, b]) => t < y - 1 && b > y + 1);
  const pages = [];
  let start = 0;
  while (start < end - 1) {
    const room = (start === 0 ? H : H - TOP) - BOTTOM;
    let stop = end;
    if (end - start > room) {
      const limit = start + room;
      stop = tops.filter((y) => y > start + room * 0.3 && y <= limit && isSafe(y)).pop() ?? limit;
    }
    pages.push([start, stop]);
    start = stop;
  }
  return pages;
}

function pageCanvas(source, [from, to], isFirst, sidebar) {
  const s = CONFIG.exportScale;
  const page = document.createElement('canvas');
  page.width = W * s;
  page.height = H * s;
  const ctx = page.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, page.width, page.height);
  if (sidebar) {
    ctx.fillStyle = sidebar.color;
    ctx.fillRect(Math.round(sidebar.x * page.width), 0, Math.ceil(sidebar.width * page.width), page.height);
  }
  const sy = Math.round(from * s);
  const sh = Math.min(source.height - sy, Math.round((to - from) * s));
  ctx.drawImage(source, 0, sy, source.width, sh, 0, isFirst ? 0 : TOP * s, page.width, sh);
  return page;
}

async function toPdf(html, template, filename) {
  const [{ canvas, blocks, height }] = await Promise.all([capture(html), loadScript(CDN.jspdf)]);
  const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
  paginate(blocks, height).forEach((range, i) => {
    if (i) doc.addPage();
    doc.addImage(pageCanvas(canvas, range, i === 0, template.sidebar).toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
  });
  downloadBlob(doc.output('blob'), `${filename}.pdf`);
}

async function toPng(html, filename) {
  const { canvas } = await capture(html);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  downloadBlob(blob, `${filename}.png`);
}

async function toHtml(html, name, filename) {
  const css = await Promise.all(['css/cv.css', 'css/templates.css'].map((url) => fetch(url).then((r) => r.text())));
  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=834">
<title>${esc(name)} - CV</title>
<style>
${css.join('\n')}
body { margin: 0; padding: 20px 0; background: #e9ebef; }
.cv { margin: 0 auto; box-shadow: 0 4px 20px rgba(0, 0, 0, .12); }
@media print { body { padding: 0; background: #fff; } }
</style>
</head>
<body>
${html}
</body>
</html>`;
  downloadBlob(new Blob([page], { type: 'text/html' }), `${filename}.html`);
}

// kind: 'pdf' | 'png' | 'html' | 'print'
export async function exportCv(kind, data, templateId) {
  if (kind === 'print') return window.print();
  const template = getTemplate(templateId);
  const view = buildView(data);
  const html = template.render(view);
  const filename = `${view.name.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}-CV`;
  if (kind === 'pdf') return toPdf(html, template, filename);
  if (kind === 'png') return toPng(html, filename);
  return toHtml(html, view.name, filename);
}
