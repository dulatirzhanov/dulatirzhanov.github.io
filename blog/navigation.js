(function () {
  const labels = {en: ['/', '← Back to Home', 'Get in touch'], ru: ['/ru/', '← На главную', 'Написать'], kz: ['/kz/', '← Басты бетке', 'Хабарласу']};
  let lang = new URLSearchParams(location.search).get('lang');
  if (!Object.hasOwn(labels, lang)) {
    lang = null;
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === location.origin) {
        if (/^\/ru(?:\/|$)/.test(ref.pathname)) lang = 'ru';
        else if (/^\/kz(?:\/|$)/.test(ref.pathname)) lang = 'kz';
        else if (ref.pathname === '/') lang = 'en';
      }
    } catch (_) {}
    try { lang = lang || sessionStorage.getItem('blogHomeLanguage'); } catch (_) {}
  }
  if (!Object.hasOwn(labels, lang)) lang = 'en';
  try { sessionStorage.setItem('blogHomeLanguage', lang); } catch (_) {}
  const [home, back, contact] = labels[lang];
  const homeLink = document.getElementById('blogHome');
  homeLink.href = home; homeLink.textContent = back;
  const contactLink = document.getElementById('blogContacts');
  contactLink.href = home + '#contacts'; contactLink.textContent = contact;
})();
