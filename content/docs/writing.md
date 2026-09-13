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

## Shortcodes

The theme ships callouts, cards, tabs and more.

{{< callout emoji="💡" >}}
Callouts are good for tips and warnings.
{{< /callout >}}

{{< tabs items="npm,yarn" >}}
  {{< tab >}}Tabs group alternative instructions.{{< /tab >}}
  {{< tab >}}One tab per option.{{< /tab >}}
{{< /tabs >}}
