# Library pages

Run `node tools/build-pages.js` (or `node scripts/build-library-pages.mjs`) with Node.js 22 or newer after changing library data, translations, templates, CSS/JS versions or the case/topic HTML shells. Commit the generated HTML and sitemap together with the source changes. No packages are required.

Case pages: `/sim/ru/<id>.html` and `/sim/kz/<id>.html`.
Topic pages: `/sources/<id>.html` and `/sources/kz/<id>.html`.

The builder renders the existing browser templates in an isolated Node VM and captures their initial markup before DOM event binding. It adds canonical URLs, language alternates, descriptions and Open Graph/Twitter metadata, then retains the normal scripts to enable the interactive experience. Without JavaScript, the case text and analysis remain readable and source details open natively. Library indexes include crawlable detail links.

The old `case.html?id=...` and `topic.html?id=...` addresses redirect to the matching static page and retain the hash. They remain excluded from search; the static pages and library indexes are indexable. Preview images use the existing `/og-image.jpg`.

When removing or renaming a case/topic ID, remove its previously generated HTML in both languages as well. Do not edit generated detail pages directly.
