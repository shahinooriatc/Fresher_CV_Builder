// The whole form is described here. To add, remove or rename a field, edit this
// file only: the form, the review page and the saved data all follow it.
//
// Tab     = one step of the form.
// Section = { key, fields }              -> saved as an object  data[key]
//           { key, list: true, fields }  -> saved as an array   data[key]
// Field   = { k, label, type?, ph?, hint?, full?, req?, options? }
//           type: text (default) | email | tel | date | textarea | select | photo

const L = (bn, en) => ({ bn, en });
const opts = (...pairs) => pairs.map(([v, bn]) => ({ v, label: L(bn, v) }));

export const TABS = [
  {
    id: 'personal',
    label: L('ব্যক্তিগত', 'Personal'),
    sections: [{
      key: 'personal',
      fields: [
        { k: 'photo', type: 'photo', label: L('ছবি (ঐচ্ছিক)', 'Photo (optional)'), full: true },
        { k: 'fullName', label: L('পূর্ণ নাম', 'Full name'), ph: 'Md. Rakib Hasan', req: true },
        { k: 'title', label: L('পদবি / যে পদে আবেদন', 'Job title / position applied for'), ph: 'Junior Web Developer' },
        { k: 'phone', type: 'tel', label: L('মোবাইল', 'Mobile'), ph: '+880 1XXX-XXXXXX' },
        { k: 'email', type: 'email', label: L('ইমেইল', 'Email'), ph: 'name@example.com' },
        { k: 'address', label: L('বর্তমান ঠিকানা', 'Present address'), ph: 'Companiganj, Sylhet', full: true },
        { k: 'linkedin', label: L('LinkedIn (ঐচ্ছিক)', 'LinkedIn (optional)'), ph: 'linkedin.com/in/username' },
        { k: 'website', label: L('পোর্টফোলিও / GitHub (ঐচ্ছিক)', 'Portfolio / GitHub (optional)'), ph: 'github.com/username' },
      ],
    }],
  },
  {
    id: 'objective',
    label: L('অবজেক্টিভ', 'Objective'),
    sections: [{
      key: 'objective',
      fields: [{
        k: 'text', type: 'textarea', full: true, rows: 6,
        label: L('ক্যারিয়ার অবজেক্টিভ', 'Career objective'),
        hint: L('২-৪ বাক্যে ইংরেজিতে লিখুন: আপনি কী পারেন এবং কোন ধরনের কাজ খুঁজছেন।', 'Write 2-4 sentences: what you can do and what kind of role you want.'),
        ph: 'To build a career in a reputed organization where I can apply my skills…',
      }],
    }],
  },
  {
    id: 'education',
    label: L('শিক্ষা', 'Education'),
    hint: L('সর্বশেষ ডিগ্রি আগে লিখুন।', 'Put your latest degree first.'),
    sections: [{
      key: 'education', list: true, start: 1, itemLabel: L('শিক্ষাগত যোগ্যতা', 'Qualification'),
      fields: [
        { k: 'degree', label: L('পরীক্ষা / ডিগ্রি', 'Exam / degree'), ph: 'BSc in CSE' },
        { k: 'major', label: L('বিভাগ / গ্রুপ / বিষয়', 'Group / major'), ph: 'Science' },
        { k: 'institute', label: L('শিক্ষা প্রতিষ্ঠান', 'Institute'), ph: 'Metropolitan University', full: true },
        { k: 'board', label: L('বোর্ড / বিশ্ববিদ্যালয়', 'Board / university'), ph: 'Sylhet' },
        { k: 'year', label: L('পাসের সাল', 'Passing year'), ph: '2024' },
        { k: 'result', label: L('ফলাফল', 'Result'), ph: 'GPA 5.00 / CGPA 3.75' },
      ],
    }],
  },
  {
    id: 'experience',
    label: L('অভিজ্ঞতা', 'Experience'),
    hint: L('ফ্রেশার হলে এই ধাপ ফাঁকা রাখতে পারেন। ইন্টার্নশিপ বা পার্ট-টাইম কাজও এখানে দিন।', 'Freshers can skip this step. Internships and part-time work count too.'),
    sections: [{
      key: 'experience', list: true, itemLabel: L('অভিজ্ঞতা', 'Experience'),
      fields: [
        { k: 'position', label: L('পদবি', 'Position'), ph: 'Intern, Web Development' },
        { k: 'company', label: L('প্রতিষ্ঠান', 'Organization'), ph: 'ABC IT Ltd.' },
        { k: 'location', label: L('স্থান', 'Location'), ph: 'Sylhet' },
        { k: 'start', label: L('শুরু', 'Start'), ph: 'Jan 2024' },
        { k: 'end', label: L('শেষ', 'End'), ph: 'Present' },
        { k: 'details', type: 'textarea', full: true, rows: 4, label: L('দায়িত্ব ও অর্জন', 'Responsibilities & achievements'), hint: L('প্রতি লাইনে একটি পয়েন্ট লিখুন।', 'One point per line.') },
      ],
    }],
  },
  {
    id: 'skills',
    label: L('দক্ষতা', 'Skills'),
    sections: [
      {
        key: 'skills',
        fields: [
          { k: 'technical', type: 'textarea', full: true, rows: 3, label: L('কারিগরি দক্ষতা', 'Technical skills'), hint: L('কমা দিয়ে আলাদা করুন।', 'Separate with commas.'), ph: 'MS Word, MS Excel, HTML, CSS, JavaScript' },
          { k: 'soft', type: 'textarea', full: true, rows: 2, label: L('অন্যান্য দক্ষতা', 'Soft skills'), ph: 'Communication, Teamwork, Problem solving' },
          { k: 'languages', label: L('ভাষা', 'Languages'), full: true, ph: 'Bangla (Native), English (Fluent)' },
        ],
      },
      {
        key: 'training', list: true, title: L('প্রশিক্ষণ / সার্টিফিকেট', 'Training / certificates'), itemLabel: L('প্রশিক্ষণ', 'Training'),
        fields: [
          { k: 'title', label: L('কোর্সের নাম', 'Course title'), ph: 'Web Design & Development', full: true },
          { k: 'institute', label: L('প্রতিষ্ঠান', 'Institute'), ph: 'Creative IT Institute' },
          { k: 'year', label: L('সাল / মেয়াদ', 'Year / duration'), ph: '2023 (6 months)' },
        ],
      },
      {
        key: 'projects', list: true, title: L('প্রজেক্ট', 'Projects'), itemLabel: L('প্রজেক্ট', 'Project'),
        fields: [
          { k: 'name', label: L('প্রজেক্টের নাম', 'Project name'), ph: 'College Management System' },
          { k: 'link', label: L('লিংক (ঐচ্ছিক)', 'Link (optional)'), ph: 'github.com/username/project' },
          { k: 'details', type: 'textarea', full: true, rows: 3, label: L('বিবরণ', 'Description'), hint: L('প্রতি লাইনে একটি পয়েন্ট লিখুন।', 'One point per line.') },
        ],
      },
    ],
  },
  {
    id: 'family',
    label: L('অন্যান্য তথ্য', 'Other info'),
    sections: [{
      key: 'family',
      fields: [
        { k: 'fatherName', label: L('পিতার নাম', "Father's name") },
        { k: 'motherName', label: L('মাতার নাম', "Mother's name") },
        { k: 'dob', type: 'date', label: L('জন্ম তারিখ', 'Date of birth') },
        { k: 'gender', type: 'select', label: L('লিঙ্গ', 'Gender'), options: opts(['Male', 'পুরুষ'], ['Female', 'নারী'], ['Other', 'অন্যান্য']) },
        { k: 'marital', type: 'select', label: L('বৈবাহিক অবস্থা', 'Marital status'), options: opts(['Unmarried', 'অবিবাহিত'], ['Married', 'বিবাহিত']) },
        { k: 'nationality', label: L('জাতীয়তা', 'Nationality'), ph: 'Bangladeshi' },
        { k: 'religion', label: L('ধর্ম (ঐচ্ছিক)', 'Religion (optional)') },
        { k: 'bloodGroup', type: 'select', label: L('রক্তের গ্রুপ', 'Blood group'), options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((v) => ({ v, label: L(v, v) })) },
        { k: 'permanentAddress', label: L('স্থায়ী ঠিকানা', 'Permanent address'), full: true },
        { k: 'interests', label: L('শখ / আগ্রহ', 'Interests'), full: true, ph: 'Reading, Travelling, Cricket' },
      ],
    }],
  },
  {
    id: 'references',
    label: L('রেফারেন্স', 'References'),
    hint: L('যিনি আপনাকে চেনেন এমন শিক্ষক বা কর্মকর্তার তথ্য দিন (ঐচ্ছিক)।', 'A teacher or supervisor who knows you (optional).'),
    sections: [{
      key: 'references', list: true, itemLabel: L('রেফারেন্স', 'Reference'),
      fields: [
        { k: 'name', label: L('নাম', 'Name') },
        { k: 'designation', label: L('পদবি', 'Designation') },
        { k: 'organization', label: L('প্রতিষ্ঠান', 'Organization'), full: true },
        { k: 'phone', type: 'tel', label: L('মোবাইল', 'Mobile') },
        { k: 'email', type: 'email', label: L('ইমেইল', 'Email') },
      ],
    }],
  },
];

const blankItem = () => ({});

export function emptyData() {
  const data = {};
  for (const tab of TABS) {
    for (const s of tab.sections) {
      data[s.key] = s.list ? Array.from({ length: s.start || 0 }, blankItem) : {};
    }
  }
  return data;
}

const filled = (v) => String(v ?? '').trim() !== '';
export const itemHasData = (item) => !!item && Object.values(item).some(filled);

export function tabHasData(tab, data) {
  return tab.sections.some((s) => (s.list ? (data[s.key] || []).some(itemHasData) : itemHasData(data[s.key])));
}
