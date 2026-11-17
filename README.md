# ICTebook CV Builder

A static CV / resume builder for students and fresh graduates. No build step and
no backend: plain HTML, CSS and JavaScript modules. Push the folder to GitHub and
turn on GitHub Pages.

## What it does

1. Student signs in with their ICTebook account (Google, through Supabase Auth).
2. Fills a 7-step form: Personal, Objective, Education, Experience, Skills,
   Other info, References. Steps can be visited in any order and left unfinished.
3. Reviews everything on one page.
4. Presses "Generate my CV", picks one of 5 templates, and downloads it as
   PDF, PNG image or HTML, or prints it.

CV data is saved only in the student's browser (localStorage, one record per
account). Nothing is written to the ICTebook database.

## Folder structure

```
index.html
assets/            ICTebook logos (light/dark) and the sample passport photo
css/
  app.css          interface (mobile first)
  cv.css           base styles shared by all CV templates + print rules
  templates.css    one block per template
js/
  config.js        ALL settings (Supabase keys, default language/template)
  schema.js        the form definition: tabs, fields, labels (bn/en)
  i18n.js          interface text in Bangla and English
  store.js         saving/loading in localStorage
  auth.js          ICTebook login
  export.js        PDF / PNG / HTML / print
  app.js           entry point: screens and click handling
  utils.js         small helpers
  icons.js         inline SVG icons for buttons
  views/           form.js, review.js, preview.js (HTML for each screen)
  templates/       helpers.js (shared CV parts), index.js (registry),
                   classic.js, fresher.js, modern.js, creative.js, ats.js
```

## Common changes

- **Add or rename a form field:** edit `js/schema.js`. The form and the review
  page update automatically. To show the new field on the CV, add it in
  `buildView()` in `js/templates/helpers.js`.
- **Add a template:** copy `js/templates/classic.js`, give it a new `id`, add a
  `.cv--<id>` block in `css/templates.css`, and list it in `js/templates/index.js`.
- **Change interface text:** `js/i18n.js`.

## Run locally

JavaScript modules do not load from `file://`, so use a local server:

```
npx serve .
```

or the "Live Server" extension in VS Code. To skip login while developing, set
`auth.mode` to `'off'` in `js/config.js` (set it back to `'supabase'` before pushing).

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Repository Settings > Pages > Deploy from branch > `main` / root.
3. **Required once for login:** in the Supabase dashboard of `ictebook-prod`,
   open Authentication > URL Configuration and add the live address
   (for example `https://<username>.github.io/<repo>/`) to **Redirect URLs**.
   Without this, Google sign-in returns to ictebook.com instead of the CV builder.
4. On ictebook.com, link the "Build my CV" button to the live address.

## Libraries (loaded from jsDelivr only when needed)

- `@supabase/supabase-js@2` for login
- `html2canvas@1.4.1` and `jspdf@2.5.1` for PDF and image download
