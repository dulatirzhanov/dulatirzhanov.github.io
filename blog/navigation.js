(function () {
  // Only navigation and contact copy change language; publications keep their originals.
  const labels = {
    en: ['/', 'Home', 'Get in touch', 'Blog', 'Path', 'First conversation', 'The first conversation is free. A simple question is reason enough to write.', 'School questionnaire'],
    ru: ['/ru/', 'Главная', 'Написать', 'Блог', 'Путь', 'Первый разговор', 'Первый разговор бесплатный. Можно написать с простым вопросом.', 'Анкета школы'],
    kz: ['/kz/', 'Басты бет', 'Хабарласу', 'Блог', 'Жол', 'Алғашқы әңгіме', 'Алғашқы әңгіме тегін. Қарапайым сұрақпен де хабарласуға болады.', 'Мектеп сауалнамасы']
  };
  let lang = new URLSearchParams(location.search).get('lang');
  if (!Object.hasOwn(labels, lang)) {
    lang = null;
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === location.origin) {
        if (/^\/(?:ru|sim\/ru|sources)(?:\/|$)/.test(ref.pathname)) lang = 'ru';
        if (/^\/(?:kz|sim\/kz|sources\/kz)(?:\/|$)/.test(ref.pathname)) lang = 'kz';
        else if (ref.pathname === '/') lang = 'en';
      }
    } catch (_) {}
    try { lang = lang || sessionStorage.getItem('blogHomeLanguage'); } catch (_) {}
  }
  if (!Object.hasOwn(labels, lang)) lang = 'en';
  try { sessionStorage.setItem('blogHomeLanguage', lang); } catch (_) {}
  const [home, back, contact, current, path, title, text, questionnaire] = labels[lang];
  const homeLink = document.getElementById('blogHome');
  homeLink.href = home; homeLink.textContent = back;
  const contactLink = document.getElementById('blogContacts');
  contactLink.href = home + '#contacts'; contactLink.textContent = contact;
  document.getElementById('blogCurrent').textContent = current;
  document.querySelector('.crumbs').setAttribute('aria-label', path);
  document.getElementById('contact-heading').textContent = title;
  document.getElementById('blogContactText').textContent = text;
  const formLink = document.getElementById('blogQuestionnaire');
  formLink.href = '/tools/' + lang + '/express-audit.html'; formLink.textContent = questionnaire;
  document.getElementById('blogFooterHome').href = home;
  document.querySelectorAll('.crumbs, .contact-block').forEach(el => el.lang = lang === 'kz' ? 'kk' : lang);
  document.querySelectorAll('[data-navigation-language]').forEach(link => {
    const active = link.dataset.navigationLanguage === lang;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
    const url = new URL(location.href);
    url.searchParams.set('lang', link.dataset.navigationLanguage);
    link.href = url.pathname + url.search + url.hash;
  });
})();
