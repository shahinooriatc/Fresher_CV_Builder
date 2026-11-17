// Builds the HTML of the multi-tab form from schema.js. Pure rendering:
// clicks and typing are handled in app.js through data-action / data-path.
import { TABS, tabHasData } from '../schema.js';
import { num, t, tr } from '../i18n.js';
import { ICON } from '../icons.js';
import { esc } from '../utils.js';

// The row of step pills plus a thin progress line. activeId is a tab id or 'review'.
export function tabBar(data, activeId) {
  const index = TABS.findIndex((tab) => tab.id === activeId);
  const done = index < 0 ? TABS.length : index + 1;
  const pills = TABS.map((tab, i) => {
    const filled = tabHasData(tab, data);
    return `<button class="pill ${tab.id === activeId ? 'is-active' : ''} ${filled ? 'is-done' : ''}"
      data-action="tab" data-id="${tab.id}"><span class="pill-n">${filled ? ICON.check : num(i + 1)}</span>${esc(tr(tab.label))}</button>`;
  }).join('');
  return `<nav class="pills" aria-label="Steps">${pills}
      <button class="pill pill-plain ${activeId === 'review' ? 'is-active' : ''}" data-action="review">${t('review')}</button></nav>
    <div class="progress" aria-hidden="true"><i style="width:${Math.round((done / TABS.length) * 100)}%"></i></div>`;
}

// Photo upload: a sample passport photo until the student adds their own, with short tips.
function photoField(path, value) {
  const tips = ['photoTip1', 'photoTip2', 'photoTip3'].map((key) => `<li>${ICON.check}<span>${t(key)}</span></li>`).join('');
  return `<div class="photo">
    <div class="photo-frame ${value ? '' : 'is-sample'}" ${value ? `style="background-image:url('${esc(value)}')"` : ''}>
      ${value ? '' : `<span class="photo-badge">${t('sample')}</span>`}
    </div>
    <div class="photo-info">
      <strong>${t('photoTitle')}</strong>
      <ul class="tips">${tips}</ul>
    </div>
    <div class="photo-actions">
      <label class="btn btn-soft grow">${ICON.camera}<span>${t(value ? 'changePhoto' : 'uploadPhoto')}</span>
        <input type="file" accept="image/*" data-photo="${path}" hidden></label>
      ${value ? `<button class="btn btn-ghost danger" data-action="photo-remove" data-path="${path}">${ICON.trash}<span>${t('remove')}</span></button>` : ''}
    </div>
  </div>`;
}

function field(f, path, value) {
  const id = `f-${path.replace(/\./g, '-')}`;
  const v = esc(value);
  const common = `id="${id}" data-path="${path}"`;
  let control;
  if (f.type === 'textarea') {
    control = `<textarea ${common} rows="${f.rows || 3}" placeholder="${esc(f.ph)}">${v}</textarea>`;
  } else if (f.type === 'select') {
    const options = f.options.map((o) => `<option value="${esc(o.v)}" ${o.v === value ? 'selected' : ''}>${esc(tr(o.label))}</option>`).join('');
    control = `<select ${common}><option value=""></option>${options}</select>`;
  } else if (f.type === 'photo') {
    control = photoField(path, value);
  } else {
    control = `<input ${common} type="${f.type || 'text'}" value="${v}" placeholder="${esc(f.ph)}" autocomplete="off">`;
  }
  const label = `${esc(tr(f.label))}${f.req ? ' <b class="req">*</b>' : ''}`;
  return `<div class="field ${f.full ? 'field-full' : ''}">
    ${f.type === 'photo' ? `<span class="label">${label}</span>` : `<label class="label" for="${id}">${label}</label>`}
    ${control}${f.hint ? `<p class="hint">${esc(tr(f.hint))}</p>` : ''}</div>`;
}

const fieldGrid = (fields, basePath, values = {}) =>
  `<div class="grid">${fields.map((f) => field(f, `${basePath}.${f.k}`, values[f.k])).join('')}</div>`;

function listSection(s, items = []) {
  const cards = items.map((item, i) => `
    <div class="item">
      <div class="item-head"><span class="item-n">${num(i + 1)}</span><strong>${esc(tr(s.itemLabel))}</strong>
        <button class="icon-btn danger" data-action="remove" data-key="${s.key}" data-index="${i}" aria-label="${t('remove')}">${ICON.trash}</button></div>
      ${fieldGrid(s.fields, `${s.key}.${i}`, item)}
    </div>`).join('');
  return `${cards}<button class="btn btn-add btn-block" data-action="add" data-key="${s.key}">${ICON.plus}<span>${esc(tr(s.itemLabel))} ${t('add')}</span></button>`;
}

export function formView(data, tabId) {
  const index = Math.max(0, TABS.findIndex((x) => x.id === tabId));
  const tab = TABS[index];
  const last = index === TABS.length - 1;
  const sections = tab.sections.map((s) => `
    ${s.title ? `<h3 class="sub">${esc(tr(s.title))}</h3>` : ''}
    ${s.list ? listSection(s, data[s.key]) : fieldGrid(s.fields, s.key, data[s.key])}`).join('');

  return `${tabBar(data, tab.id)}
    <section class="card">
      <div class="card-head"><h2>${esc(tr(tab.label))}</h2>
        <span class="chip">${t('step')} ${num(index + 1)}/${num(TABS.length)}</span></div>
      ${tab.hint ? `<p class="muted">${esc(tr(tab.hint))}</p>` : ''}
      ${sections}
    </section>
    <div class="actionbar">
      <button class="btn btn-outline" data-action="prev" ${index === 0 ? 'disabled' : ''}>${ICON.left}<span>${t('prev')}</span></button>
      <button class="btn btn-primary grow" data-action="${last ? 'review' : 'next'}"><span>${t(last ? 'toReview' : 'next')}</span>${ICON.right}</button>
    </div>`;
}
