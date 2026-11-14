/* One contact dialog for buttons, shared links and browser history. */
(function () {
  const modal = document.getElementById('contactsModal');
  const overlay = document.getElementById('overlay');
  const close = document.getElementById('closeContacts');
  let returnFocus;
  let previousOverflow;

  function syncDialog() {
    const open = location.hash === '#contacts';
    if (open === (modal.style.display === 'block')) return;
    if (open) {
      returnFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      modal.style.display = overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      close.focus();
      // Menu and bio buttons are tracked by analytics.js; include the new entry paths.
      if (window.track && !['openContacts', 'openContactsCta'].includes(returnFocus.id)) {
        window.track('contact_open', { source: returnFocus.id === 'openContactsHero' ? 'hero' : 'direct_link', page: location.pathname });
      }
    } else {
      modal.style.display = overlay.style.display = 'none';
      document.body.style.overflow = previousOverflow || '';
      const target = returnFocus && returnFocus !== document.body ? returnFocus : document.getElementById('openContacts');
      target.focus({ preventScroll: true });
    }
  }

  function closeDialog() {
    if (location.hash !== '#contacts') return;
    history.replaceState(null, '', location.pathname + location.search);
    syncDialog();
  }

  document.querySelectorAll('#openContacts, #openContactsCta, #openContactsHero').forEach(button => {
    button.addEventListener('click', () => {
      if (location.hash !== '#contacts') history.pushState(null, '', '#contacts');
      syncDialog();
    });
  });
  close.addEventListener('click', closeDialog);
  overlay.addEventListener('click', closeDialog);
  document.addEventListener('keydown', event => {
    if (modal.style.display !== 'block') return;
    if (event.key === 'Escape') closeDialog();
    if (event.key !== 'Tab') return;
    const items = [...modal.querySelectorAll('button, a[href]')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  document.addEventListener('focusin', event => {
    if (modal.style.display === 'block' && !modal.contains(event.target)) close.focus();
  });
  window.addEventListener('hashchange', syncDialog);
  window.addEventListener('popstate', syncDialog);
  syncDialog();
})();
