/* Появление текста главной при прокрутке.
   Элементы, которые уже видны при загрузке, не трогаем: иначе будет вспышка.
   Без IntersectionObserver или при сбое скрипта текст остается видимым. */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var items = document.querySelectorAll('.home-page .bio > p, .home-page .bio li');
  var below = [];
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) below.push(el);
  });
  if (!below.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

  below.forEach(function (el) {
    // короткая лесенка только для соседних элементов, видимых одновременно: 0, 40, 80 мс
    el.style.setProperty('--reveal-delay', (below.indexOf(el) % 3) * 40 + 'ms');
    el.classList.add('reveal');
    io.observe(el);
  });
})();
