/* Compatible build entry point. Renders complete HTML and metadata from the shared templates. */
import("../scripts/build-library-pages.mjs").catch(error => { console.error(error); process.exitCode = 1; });
