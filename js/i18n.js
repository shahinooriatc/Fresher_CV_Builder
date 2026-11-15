// Interface language (Bangla / English). The CV itself is always in English.
import { CONFIG } from './config.js';
import { ls } from './utils.js';

const KEY = 'cvb:lang';
let lang = ls.get(KEY) || CONFIG.defaultLang;

export const getLang = () => lang;
export function setLang(next) { lang = next; ls.set(KEY, next); document.documentElement.lang = next; }

// tr({bn, en}) picks the current language from a label object.
export const tr = (label) => (label && typeof label === 'object' ? label[lang] ?? label.en : label ?? '');

const STR = {
  loading: { bn: 'লোড হচ্ছে…', en: 'Loading…' },
  logout: { bn: 'লগআউট', en: 'Log out' },
  loginTitle: { bn: 'লগইন করে CV তৈরি করুন', en: 'Sign in to build your CV' },
  loginSub: { bn: 'আপনার ICTebook অ্যাকাউন্ট দিয়ে লগইন করুন। আপনার তথ্য শুধু এই ডিভাইসেই সেভ থাকবে।', en: 'Sign in with your ICTebook account. Your information stays on this device only.' },
  loginGoogle: { bn: 'Google দিয়ে লগইন', en: 'Continue with Google' },
  loginNoAccount: { bn: 'অ্যাকাউন্ট নেই? ICTebook-এ খুলুন', en: 'No account? Create one on ICTebook' },
  loginFailed: { bn: 'লগইন করা যায়নি। আবার চেষ্টা করুন।', en: 'Sign-in failed. Please try again.' },
  configError: { bn: 'লগইন সার্ভিসে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ দেখে পেজটি রিফ্রেশ করুন।', en: 'Could not reach the sign-in service. Check your connection and refresh the page.' },
  prev: { bn: 'আগের ধাপ', en: 'Back' },
  next: { bn: 'সেভ করে পরের ধাপ', en: 'Save & next' },
  toReview: { bn: 'সেভ করে সব তথ্য দেখুন', en: 'Save & review' },
  review: { bn: 'রিভিউ', en: 'Review' },
  reviewTitle: { bn: 'আপনার সব তথ্য', en: 'All your information' },
  reviewSub: { bn: 'সব ঠিক আছে কি না দেখে নিন। ভুল থাকলে "এডিট" চাপুন।', en: 'Check everything. Tap "Edit" to fix a section.' },
  edit: { bn: 'এডিট', en: 'Edit' },
  empty: { bn: 'কোনো তথ্য দেওয়া হয়নি', en: 'Nothing added yet' },
  generate: { bn: 'আমার CV তৈরি করুন', en: 'Generate my CV' },
  needName: { bn: 'আগে আপনার পূর্ণ নাম লিখুন।', en: 'Please enter your full name first.' },
  add: { bn: 'আরও যোগ করুন', en: 'Add another' },
  remove: { bn: 'মুছুন', en: 'Remove' },
  choosePhoto: { bn: 'ছবি বাছুন', en: 'Choose photo' },
  changePhoto: { bn: 'ছবি বদলান', en: 'Change photo' },
  badPhoto: { bn: 'ছবিটি পড়া যায়নি। অন্য ছবি দিন।', en: 'Could not read that image. Try another one.' },
  saveFailed: { bn: 'সেভ করা যায়নি। ব্রাউজারের স্টোরেজ ভরে গেছে।', en: 'Could not save. Browser storage is full.' },
  chooseTemplate: { bn: 'টেমপ্লেট বাছুন', en: 'Choose a template' },
  editInfo: { bn: 'তথ্য এডিট', en: 'Edit info' },
  pdf: { bn: 'PDF', en: 'PDF' },
  image: { bn: 'ছবি', en: 'Image' },
  html: { bn: 'HTML', en: 'HTML' },
  print: { bn: 'প্রিন্ট', en: 'Print' },
  working: { bn: 'তৈরি হচ্ছে…', en: 'Preparing…' },
  downloaded: { bn: 'ডাউনলোড শুরু হয়েছে', en: 'Download started' },
  exportFailed: { bn: 'ফাইল তৈরি করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।', en: 'Could not create the file. Check your connection and try again.' },
};

export const t = (key) => tr(STR[key]) || key;
