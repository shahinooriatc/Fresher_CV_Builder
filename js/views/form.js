// Builds the HTML of the multi-tab form from schema.js. Pure rendering:
// clicks and typing are handled in app.js through data-action / data-path.
import { TABS, tabHasData } from '../schema.js';
import { t, tr } from '../i18n.js';
import { esc } from '../utils.js';

export function tabBar(data, activeId) {
  const pills = TABS.map((tab, i) => `
    <button class="pill ${tab.id === activeId ? 'is-active' : ''} ${tabHasData(tab, data) ? 'is-done' : ''}"
      data-action="tab" data-id="${tab.id}"><span class="pill-n">${i + 1}</span>${esc(tr(tab.label))}</button>`).join('');
  return `<nav class="pills" aria-label="Steps">${pills}
    <button class="pill ${activeId === 'review' ? 'is-active' : ''}" data-action="review">${t('review')}</button></nav>`;
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
    control = `<div class="photo-row">
      <div class="photo-box" ${value ? `style="background-image:url('${v}')"` : ''}></div>
      <label class="btn btn-soft">${t(value ? 'changePhoto' : 'choosePhoto')}
        <input type="file" accept="image/*" data-photo="${path}" hidden></label>
      ${value ? `<button class="btn btn-text danger" data-action="photo-remove" data-path="${path}">${t('remove')}</button>` : ''}
    </div>`;
  } else {
    control = `<input ${common} type="${f.type || 'text'}" value="${v}" placeholder="${esc(f.ph)}" autocomplete="off">`;
  }
  return `<div class="field ${f.full ? 'field-full' : ''}">
    <label for="${id}">${esc(tr(f.label))}${f.req ? ' <b class="req">*</b>' : ''}</label>
    ${control}${f.hint ? `<p class="hint">${esc(tr(f.hint))}</p>` : ''}</div>`;
}

const fieldGrid = (fields, basePath, values = {}) =>
  `<div class="grid">${fields.map((f) => field(f, `${basePath}.${f.k}`, values[f.k])).join('')}</div>`;

function listSection(s, items = []) {
  const cards = items.map((item, i) => `
    <div class="item">
      <div class="item-head"><strong>${esc(tr(s.itemLabel))} ${i + 1}</strong>
        <button class="btn btn-text danger" data-action="remove" data-key="${s.key}" data-index="${i}">${t('remove')}</button></div>
      ${fieldGrid(s.fields, `${s.key}.${i}`, item)}
    </div>`).join('');
  return `${cards}<button class="btn btn-soft btn-block" data-action="add" data-key="${s.key}">+ ${esc(tr(s.itemLabel))} ${t('add')}</button>`;
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
      <h2>${esc(tr(tab.label))}</h2>
      ${tab.hint ? `<p class="muted">${esc(tr(tab.hint))}</p>` : ''}
      ${sections}
    </section>
    <div class="actionbar">
      <button class="btn btn-soft" data-action="prev" ${index === 0 ? 'disabled' : ''}>${t('prev')}</button>
      <button class="btn btn-primary grow" data-action="${last ? 'review' : 'next'}">${t(last ? 'toReview' : 'next')}</button>
    </div>`;
}
