// CV page: template picker, live A4 preview and the download buttons.
import { TEMPLATES, getTemplate } from '../templates/index.js';
import { buildView } from '../templates/helpers.js';
import { t, tr } from '../i18n.js';
import { ICON } from '../icons.js';
import { esc } from '../utils.js';

export const CV_WIDTH = 794; // A4 at 96 dpi

export const cvHtml = (data, templateId) => getTemplate(templateId).render(buildView(data));

export function previewView(data, templateId) {
  const view = buildView(data);
  const picker = TEMPLATES.map((tpl) => `
    <button class="tpl ${tpl.id === templateId ? 'is-active' : ''}" data-action="template" data-id="${tpl.id}">
      <span class="tpl-thumb"><span class="tpl-mini">${tpl.render(view)}</span></span>
      <span class="tpl-name">${esc(tpl.name)}</span>
      <span class="tpl-tag">${esc(tr(tpl.tag))}</span>
    </button>`).join('');

  return `<div class="subbar">
      <button class="btn btn-chip" data-action="review">${ICON.left}<span>${t('editInfo')}</span></button>
      <span class="muted">${t('chooseTemplate')}</span>
    </div>
    <div class="picker">${picker}</div>
    <div class="stage" id="stage"><div class="scaler" id="scaler">${getTemplate(templateId).render(view)}</div></div>
    <div class="actionbar">
      <button class="btn btn-primary grow" data-action="download" data-kind="pdf">${ICON.download}<span>${t('pdf')}</span></button>
      <button class="btn btn-outline grow" data-action="download" data-kind="png"><span>${t('image')}</span></button>
      <button class="btn btn-outline grow" data-action="download" data-kind="html"><span>${t('html')}</span></button>
      <button class="btn btn-outline grow" data-action="download" data-kind="print"><span>${t('print')}</span></button>
    </div>`;
}

// Shrinks the fixed-width A4 sheet so it fits the phone screen.
export function fitPreview() {
  const stage = document.getElementById('stage');
  const scaler = document.getElementById('scaler');
  if (!stage || !scaler) return;
  const scale = Math.min(1, stage.clientWidth / CV_WIDTH);
  scaler.style.transform = `scale(${scale})`;
  scaler.style.marginLeft = `${Math.max(0, (stage.clientWidth - CV_WIDTH * scale) / 2)}px`;
  stage.style.height = `${scaler.offsetHeight * scale}px`;
}

// Swaps the template without re-rendering the whole page.
export function showTemplate(data, templateId) {
  document.getElementById('scaler').innerHTML = cvHtml(data, templateId);
  document.querySelectorAll('.tpl').forEach((el) => el.classList.toggle('is-active', el.dataset.id === templateId));
  fitPreview();
}
