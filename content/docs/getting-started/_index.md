---
title: Getting started
weight: 1
prev: /docs
next: /docs/writing
---

## Requirements

- Hugo extended (the version pinned in `.github/workflows/hugo.yaml`)
- Go — the theme is installed as a Hugo Module

## Local development

```bash
hugo server
```

The site is served at http://localhost:1313 and reloads on every save.

## Building

```bash
hugo --gc --minify
```

Output lands in `public/`, which is gitignored — GitHub Actions builds and
deploys it on every push.

## The theme is pinned on purpose

`go.mod` pins Hextra to `v0.9.4` — the last release that runs on Hugo 0.131,
which is what this machine and the CI workflow both use. Newer Hextra needs
Hugo 0.146+.

{{< callout type="warning" >}}
Don't run `hugo mod get -u`. This site's look depends on theme internals, so
an upgrade will break things silently — the build still succeeds, the page
just renders wrong.
{{< /callout >}}

If you ever do bump it, re-check these, which are the parts that reach into
the theme rather than configure it:

- `assets/css/custom.css` — hides the navbar, sizes the sidebar to its
  content, and collapses subtrees. All of it keys on theme class names.
- `layouts/` — `docs/index.html`, `blog/list.html`, `blog/single.html` are
  copies of theme files with one line changed, so they won't pick up theme
  fixes.
- `type: docs` in `content/_index.md` — load-bearing: it puts both sections in
  the sidebar *and* routes the home page to `layouts/docs/index.html`.
