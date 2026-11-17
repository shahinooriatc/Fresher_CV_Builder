// Review page: shows everything the student entered, tab by tab, before generating.
import { TABS, itemHasData } from '../schema.js';
import { num, t, tr } from '../i18n.js';
import { ICON } from '../icons.js';
import { esc } from '../utils.js';
import { tabBar } from './form.js';

function display(f, value) {
  if (f.type === 'photo') return `<div class="photo-frame photo-sm" style="background-image:url('${esc(value)}')"></div>`;
  if (f.type === 'select') return esc(tr(f.options.find((o) => o.v === value)?.label) || value);
  return esc(value).replace(/\n/g, '<br>');
}

const rows = (fields, values = {}) => fields
  .filter((f) => String(values[f.k] ?? '').trim())
  .map((f) => `<div class="kv"><span>${esc(tr(f.label))}</span><div>${display(f, values[f.k])}</div></div>`).join('');

function sectionRows(s, data) {
  if (!s.list) return rows(s.fields, data[s.key]);
  return (data[s.key] || []).filter(itemHasData)
    .map((item, i) => `<div class="review-item"><strong>${esc(tr(s.itemLabel))} ${num(i + 1)}</strong>${rows(s.fields, item)}</div>`).join('');
}

export function reviewView(data) {
  const cards = TABS.map((tab) => {
    const body = tab.sections.map((s) => sectionRows(s, data)).join('');
    return `<section class="card">
      <div class="card-head"><h2>${esc(tr(tab.label))}</h2>
        <button class="btn btn-chip" data-action="tab" data-id="${tab.id}">${ICON.pencil}<span>${t('edit')}</span></button></div>
      ${body || `<p class="muted">${t('empty')}</p>`}
    </section>`;
  }).join('');

  return `${tabBar(data, 'review')}
    <div class="intro"><h1>${t('reviewTitle')}</h1><p class="muted">${t('reviewSub')}</p></div>
    ${cards}
    <div class="actionbar">
      <button class="btn btn-primary grow" data-action="generate"><span>${t('generate')}</span>${ICON.right}</button>
    </div>`;
}
