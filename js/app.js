// App entry: holds the current screen, draws it, and handles every click and
// keystroke in one place (through data-action and data-path attributes).
import { CONFIG } from './config.js';
import { authEnabled, initAuth, signInWithGoogle, signOut } from './auth.js';
import { exportCv } from './export.js';
import { getLang, setLang, t } from './i18n.js';
import { ICON } from './icons.js';
import { TABS, itemHasData } from './schema.js';
import { createStore } from './store.js';
import { esc, fileToPhoto, ls } from './utils.js';
import { formView } from './views/form.js';
import { fitPreview, previewView, showTemplate } from './views/preview.js';
import { reviewView } from './views/review.js';

const root = document.getElementById('app');
// view: loading | error | login | form | review | preview
const state = { user: null, store: null, view: 'loading', tab: TABS[0].id };

// ---- drawing ---------------------------------------------------------------

// The ICTebook logo: one file for the light theme, one for the dark theme (CSS shows the right one).
const logo = (height) => `<img class="logo-light" src="assets/logo-light.png" alt="ICTebook" height="${height}">
  <img class="logo-dark" src="assets/logo-dark.png" alt="ICTebook" height="${height}">`;

function header() {
  const lang = getLang();
  return `<header class="topbar">
    <a class="brand" href="${CONFIG.homeUrl}" aria-label="ICTebook">${logo(36)}<span class="brand-tag">${esc(CONFIG.appName)}</span></a>
    <div class="topbar-right">
      <button class="seg" data-action="lang" aria-label="Language">
        <span class="${lang === 'bn' ? 'on' : ''}">বাং</span><span class="${lang === 'en' ? 'on' : ''}">EN</span></button>
      <button class="icon-btn theme-btn" data-action="theme" aria-label="${t('theme')}">${ICON.moon}${ICON.sun}</button>
      ${state.user && authEnabled() ? `<button class="icon-btn" data-action="logout" aria-label="${t('logout')}" title="${t('logout')}">${ICON.logout}</button>` : ''}
    </div></header>`;
}

const loginView = () => `<div class="login-wrap"><section class="login">
  <div class="login-logo">${logo(64)}</div>
  <span class="brand-tag">${esc(CONFIG.appName)}</span>
  <h1>${t('loginTitle')}</h1>
  <p class="muted">${t('loginSub')}</p>
  <button class="btn btn-primary btn-block" data-action="login"><span class="g">G</span><span>${t('loginGoogle')}</span></button>
  <ul class="feats"><li>${t('feat1')}</li><li>${t('feat2')}</li><li>${t('feat3')}</li></ul>
  <a class="link" href="${CONFIG.signupUrl}">${t('loginNoAccount')}</a>
</section></div>`;

function body() {
  const { view, store, tab } = state;
  if (view === 'loading') return `<div class="loading">${t('loading')}</div>`;
  if (view === 'error') return `<div class="login-wrap"><section class="login"><p>${t('configError')}</p></section></div>`;
  if (view === 'login') return loginView();
  if (view === 'review') return reviewView(store.data);
  if (view === 'preview') return previewView(store.data, store.template);
  return formView(store.data, tab);
}

function render({ keepScroll = false } = {}) {
  root.innerHTML = `${header()}<main class="wrap ${state.view === 'preview' ? 'wrap-wide' : ''}">${body()}</main>`;
  if (state.view === 'preview') fitPreview();
  root.querySelector('.pill.is-active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  if (!keepScroll) window.scrollTo(0, 0);
}

function go(view, tab = state.tab) {
  state.store?.flush();
  state.view = view;
  state.tab = tab;
  render();
}

let toastTimer;
function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.append(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2600);
}

// ---- login state -----------------------------------------------------------

function onUser(user) {
  if ((user?.id ?? null) === (state.user?.id ?? null) && state.view !== 'loading') return;
  state.user = user;
  if (!user) { state.store = null; state.view = 'login'; return render(); }

  state.store = createStore(user.id, () => toast(t('saveFailed')));
  const personal = state.store.data.personal;
  if (!personal.fullName && user.name) state.store.set('personal.fullName', user.name);
  if (!personal.email && user.email) state.store.set('personal.email', user.email);
  state.view = 'form';
  render();
}

// ---- actions ---------------------------------------------------------------

const tabIndex = () => TABS.findIndex((tab) => tab.id === state.tab);

// Light / dark theme. The first paint is handled by the small script in index.html.
function syncThemeColor() {
  const dark = document.documentElement.classList.contains('dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1020' : '#eef2f8');
}

const actions = {
  theme() {
    const dark = document.documentElement.classList.toggle('dark');
    ls.set('cvb:theme', dark ? 'dark' : 'light');
    syncThemeColor();
  },
  lang() { setLang(getLang() === 'bn' ? 'en' : 'bn'); render({ keepScroll: true }); },
  login() { signInWithGoogle().catch(() => toast(t('loginFailed'))); },
  logout() { state.store?.flush(); signOut(); },
  tab(el) { go('form', el.dataset.id); },
  prev() { go('form', TABS[Math.max(0, tabIndex() - 1)].id); },
  next() { go('form', TABS[Math.min(TABS.length - 1, tabIndex() + 1)].id); },
  review() { go('review'); },
  generate() {
    if (!String(state.store.data.personal.fullName ?? '').trim()) { go('form', 'personal'); return toast(t('needName')); }
    go('preview');
  },
  add(el) { state.store.addItem(el.dataset.key); render({ keepScroll: true }); },
  remove(el) {
    const { key, index } = el.dataset;
    if (itemHasData(state.store.data[key][index]) && !window.confirm(`${t('remove')}?`)) return;
    state.store.removeItem(key, Number(index));
    render({ keepScroll: true });
  },
  'photo-remove'(el) { state.store.set(el.dataset.path, ''); render({ keepScroll: true }); },
  template(el) { state.store.setTemplate(el.dataset.id); showTemplate(state.store.data, el.dataset.id); },
  async download(el) {
    const label = el.innerHTML;
    el.disabled = true;
    el.textContent = t('working');
    try {
      await exportCv(el.dataset.kind, state.store.data, state.store.template);
      if (el.dataset.kind !== 'print') toast(t('downloaded'));
    } catch {
      toast(t('exportFailed'));
    } finally {
      el.disabled = false;
      el.innerHTML = label;
    }
  },
};

root.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (el && !el.disabled) actions[el.dataset.action]?.(el);
});

root.addEventListener('input', (e) => {
  if (e.target.dataset.path) state.store.set(e.target.dataset.path, e.target.value);
});

root.addEventListener('change', async (e) => {
  const path = e.target.dataset.photo;
  if (!path || !e.target.files[0]) return;
  try {
    state.store.set(path, await fileToPhoto(e.target.files[0]));
    render({ keepScroll: true });
  } catch {
    toast(t('badPhoto'));
  }
});

window.addEventListener('resize', fitPreview);

// ---- start -----------------------------------------------------------------

setLang(getLang());
syncThemeColor();
render();
initAuth(onUser).then(onUser).catch(() => { state.view = 'error'; render(); });
