const filterButtons = document.querySelectorAll('[data-language-filter]');
const postCards = document.querySelectorAll('.post-card[data-languages]');

function buildSummary(summary, index, content) {
  const tooltipId = `summary-post-${index + 1}-tooltip`;
  const text = document.createElement('span');
  const tooltip = document.createElement('div');
  const closeButton = document.createElement('button');
  const kz = document.createElement('p');
  const ru = document.createElement('p');
  const kzLabel = document.createElement('strong');
  const ruLabel = document.createElement('strong');

  summary.className = 'post-summary';
  summary.tabIndex = 0;
  summary.setAttribute('role', 'button');
  summary.setAttribute('aria-expanded', 'false');
  summary.setAttribute('aria-describedby', tooltipId);
  summary.innerHTML = '';

  text.className = 'summary-text';
  text.textContent = content.en;

  tooltip.className = 'summary-tooltip';
  tooltip.id = tooltipId;
  tooltip.setAttribute('role', 'tooltip');

  closeButton.className = 'summary-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close translation tooltip');
  closeButton.textContent = '×';

  kzLabel.textContent = 'KZ:';
  kz.append(kzLabel, ` ${content.kz}`);

  ruLabel.textContent = 'RU:';
  ru.append(ruLabel, ` ${content.ru}`);

  tooltip.append(closeButton, kz, ru);
  summary.append(text, tooltip);
}

function enhanceSummaries() {
  postCards.forEach((card, index) => {
    // postSummaries идет от старых записей к новым, карточки на странице от новых к старым
    const content = postSummaries[postCards.length - 1 - index];
    const meta = card.querySelector('.post-meta');
    let summary = card.querySelector('.post-summary');
    if (!content || !meta) return;

    if (!summary) {
      summary = document.createElement('div');
      meta.after(summary);
    }

    buildSummary(summary, index, content);
  });
}

function getLinkPlatform(url) {
  if (url.includes('cois.org')) return 'CIS';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  return 'Full post';
}

function getPrimaryPostLink(card) {
  const links = Array.from(card.querySelectorAll('.iconbtn'));
  return links.find((link) => link.href.includes('cois.org'))
    || links.find((link) => link.href.includes('linkedin.com'))
    || links[0];
}

function enhanceReadActions() {
  postCards.forEach((card) => {
    const primaryLink = getPrimaryPostLink(card);
    if (!primaryLink) return;

    const platform = getLinkPlatform(primaryLink.href);
    const title = card.querySelector('.post-title');
    if (title && !title.querySelector('.post-title-link')) {
      const titleLink = document.createElement('a');
      titleLink.className = 'post-title-link';
      titleLink.href = primaryLink.href;
      titleLink.target = '_blank';
      titleLink.rel = 'noopener noreferrer';
      titleLink.textContent = title.textContent.trim();
      title.textContent = '';
      title.append(titleLink);
    }

    if (!card.querySelector('.post-read')) {
      const read = document.createElement('div');
      const link = document.createElement('a');
      const arrow = document.createElement('span');
      read.className = 'post-read';
      link.className = 'read-link';
      link.href = primaryLink.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.append(`Read on ${platform} `);
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      link.append(arrow);
      read.append(link);
      card.append(read);
    }

    card.querySelectorAll('.iconbtn').forEach((link) => {
      link.setAttribute('aria-label', `Read on ${getLinkPlatform(link.href)}`);
    });
  });
}

function setSummaryOpen(summary, isOpen) {
  summary.classList.toggle('is-open', isOpen);
  summary.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeAllSummaries() {
  document.querySelectorAll('.post-summary.is-open').forEach((summary) => {
    setSummaryOpen(summary, false);
  });
}

function initSummaryTooltips() {
  document.querySelectorAll('.post-summary').forEach((summary) => {
    summary.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.target.closest('.summary-close')) {
        setSummaryOpen(summary, false);
        return;
      }

      const wasOpen = summary.classList.contains('is-open');
      closeAllSummaries();
      setSummaryOpen(summary, !wasOpen);
    });

    summary.addEventListener('keydown', (event) => {
      if (event.target.closest('.summary-close')) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const wasOpen = summary.classList.contains('is-open');
        closeAllSummaries();
        setSummaryOpen(summary, !wasOpen);
      }
    });

    summary.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') setSummaryOpen(summary, true);
    });

    summary.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') setSummaryOpen(summary, false);
    });
  });

  document.addEventListener('click', closeAllSummaries);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllSummaries();
  });
}

function setLanguageFilter(language) {
  document.documentElement.classList.add('is-filtering');
  closeAllSummaries();

  postCards.forEach((card) => {
    const languages = card.dataset.languages.split(' ');
    card.hidden = language !== 'all' && !languages.includes(language);
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.languageFilter === language;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguageFilter(button.dataset.languageFilter));
});

enhanceSummaries();
enhanceReadActions();
initSummaryTooltips();

// Show the first tooltip once on load so visitors discover the feature
const firstSummary = document.querySelector('.post-card:not([hidden]) .post-summary');
if (firstSummary) setSummaryOpen(firstSummary, true);
