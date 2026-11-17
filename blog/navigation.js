(function () {
  // Меняется только язык навигации и блока контакта; сами публикации остаются на языке оригинала.
  const KEY = 'blogHomeLanguage';
  const labels = {
    en: ['/', 'Home', 'Get in touch', 'Blog', 'Path', 'First conversation', 'The first conversation is free. A simple question is reason enough to write.', 'School questionnaire'],
    ru: ['/ru/', 'Главная', 'Написать', 'Блог', 'Путь', 'Первый разговор', 'Первый разговор бесплатный. Можно написать с простым вопросом.', 'Анкета школы'],
    kz: ['/kz/', 'Басты бет', 'Хабарласу', 'Блог', 'Жол', 'Алғашқы әңгіме', 'Алғашқы әңгіме тегін. Қарапайым сұрақпен де хабарласуға болады.', 'Мектеп сауалнамасы']
  };

  function fromReferrer() {
    try {
      const ref = new URL(document.referrer);
      if (ref.origin !== location.origin) return null;
      const path = ref.pathname;
      // kz проверяется раньше ru: /sources/kz/ начинается так же, как /sources/ (русские источники)
      if (/^\/(?:kz|sim\/kz|sources\/kz|tools\/kz)(?:\/|$)/.test(path)) return 'kz';
      if (/^\/(?:ru|sim|sources|tools\/ru)(?:\/|$)/.test(path)) return 'ru';
      if (path === '/' || /^\/tools\/en(?:\/|$)/.test(path)) return 'en';
    } catch (_) {}
    return null;
  }

  function fromMemory() {
    try { return localStorage.getItem(KEY); } catch (_) { return null; }
  }

  // Порядок: явный ?lang=, затем страница-источник, затем память браузера, иначе en.
  // Referrer часто пуст (новая вкладка, политика браузера), поэтому запоминаем только определенный язык:
  // запись по умолчанию закрепила бы английский.
  let lang = new URLSearchParams(location.search).get('lang');
  if (!Object.hasOwn(labels, lang)) lang = fromReferrer();
  if (Object.hasOwn(labels, lang)) {
    try { localStorage.setItem(KEY, lang); } catch (_) {}
  } else {
    lang = fromMemory();
    if (!Object.hasOwn(labels, lang)) lang = 'en';
  }

  const [home, back, contact, current, path, title, text, questionnaire] = labels[lang];
  const htmlLang = lang === 'kz' ? 'kk' : lang;
  document.documentElement.dataset.blogLang = lang;

  const steps = [
    ['#blogHome', el => { el.href = home; el.textContent = back; }],
    ['#blogCurrent', el => { el.textContent = current; }],
    ['.crumbs', el => { el.setAttribute('aria-label', path); el.lang = htmlLang; }],
    ['.contact-block', el => { el.lang = htmlLang; }],
    ['#contact-heading', el => { el.textContent = title; }],
    ['#blogContactText', el => { el.textContent = text; }],
    ['#blogContacts', el => { el.href = home + '#contacts'; el.textContent = contact; }],
    ['#blogQuestionnaire', el => { el.href = '/tools/' + lang + '/express-audit.html'; el.textContent = questionnaire; }],
    ['#blogFooterHome', el => { el.href = home; }]
  ];
  const done = new Set();

  // Скрипт стоит в <head>, чтобы подписи сменились до первой отрисовки, без мелькания английского.
  // Элемент трогаем, только когда парсер его закрыл: иначе остаток текста дописался бы после замены.
  function apply() {
    const parsed = document.readyState !== 'loading';
    steps.forEach(([selector, set]) => {
      if (done.has(selector)) return;
      const el = document.querySelector(selector);
      if (!el || !(parsed || el.nextSibling)) return;
      set(el);
      done.add(selector);
    });
    if (parsed) observer.disconnect();
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', apply);
})();
