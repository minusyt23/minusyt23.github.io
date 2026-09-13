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

{{< callout type="info" >}}
The theme is pinned in `go.mod`. Update it with `hugo mod get -u`.
{{< /callout >}}
