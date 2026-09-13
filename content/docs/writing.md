---
title: Writing content
weight: 2
prev: /docs/getting-started
---

## New pages

```bash
hugo new content docs/my-page.md
hugo new content blog/my-post.md
```

## Front matter

Docs pages use `weight` to control sidebar order; blog posts use `date` and
`tags`.

```yaml
---
title: My page
weight: 3
---
```

## Adding a section

A section is a folder under `content/` with an `_index.md`. Create one and it
appears in the sidebar on every page - no config, no layout work:

```
content/notes/
  _index.md      # title: Notes, weight: 3
  first-note.md
```

`weight` on the `_index.md` sets its position in the sidebar; `weight` on the
pages inside sets their order under it.

That gives you a docs-style section: the pages show as a collapsible tree. For
a blog-style one instead - dated entries, listed newest first, kept out of the
sidebar tree - copy the front matter from `content/blog/_index.md`:

```yaml
---
title: Notes
weight: 3
sidebar:
  exclude: false
cascade:
  type: blog
  sidebar:
    exclude: true
---
```

`cascade` applies to this page as well as its children, so the explicit
`sidebar.exclude: false` is what keeps the section itself in the sidebar while
its entries stay out.

{{< callout type="info" >}}
The sidebar's Home link comes from `[[menu.sidebar]]` in `hugo.toml`, and CSS
lifts it above the page tree. That rule assumes a single menu entry - add a
second and it will land in the wrong place.
{{< /callout >}}

## Shortcodes

The theme ships callouts, cards, tabs and more.

{{< callout emoji="💡" >}}
Callouts are good for tips and warnings.
{{< /callout >}}

{{< tabs items="npm,yarn" >}}
  {{< tab >}}Tabs group alternative instructions.{{< /tab >}}
  {{< tab >}}One tab per option.{{< /tab >}}
{{< /tabs >}}
