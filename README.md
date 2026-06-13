# The Agentic Software Engineering Handbook

**English** · [中文](README.zh.md)

A handbook on software engineering and project management in the age of coding agents — 34 chapters across 10 parts, written in parallel Chinese and English.

**Live:** https://sde.yinxinghan.com

Every concept follows the same three beats — *everyday analogy → engineering definition → real case*. Facts are grounded in first-party GitHub / OpenAI / Anthropic material, with clearly-marked secondary analysis; each one carries a clickable source.

## Local preview

Pure static, offline, no server — just open `site/index.html` in a browser. The UI picks its language from the browser (a Chinese browser shows Chinese, everything else shows English) and you can switch any time at the top right.

## Structure

```
site/                  the publishable static site
  index.html
  assets/              styles, scripts, vendored libs (marked / highlight.js), covers, favicon
  content.js           content bundle generated from markdown by build.py
book/
  content/zh/          Chinese source, one file per chapter
  content/en/          parallel English source (same filenames)
  TOC.md               detailed table of contents
research/
  sources_index.json   source-index data
```

## Rebuild

The source of truth is the markdown in `book/content/`. After editing any chapter, regenerate the site bundle:

```bash
python3 site/build.py
```

## Deploy

On push, `.github/workflows/pages.yml` publishes `site/` to GitHub Pages; the custom domain lives in `site/CNAME`.

## Sources & shelf life

Facts are current as of **2026-06-13**. This corner of software moves fast — re-check feature / price / version claims against the official pages. Known source caveats are in Chapter 34.

## License

Handbook text © 2026 yinxinghan.com. Short quotations from vendor blogs remain the property of their authors and are used for educational citation.
