# The Agentic Software Engineering Handbook

**English** · [中文](README.zh.md)

A handbook on software engineering and project management in the age of coding agents — 34 chapters, written in parallel Chinese and English.

**Live:** https://sde.yinxinghan.com

Every concept follows the same three beats — *everyday analogy → engineering definition → real case*. Facts are grounded in first-party GitHub / OpenAI / Anthropic material, with secondary analysis clearly marked; each carries a clickable source.

## This repository

This repo holds the **published static site** (`site/`). It's plain HTML/CSS/JS with the content bundled into `site/content.js` — open `site/index.html` in a browser to read it offline; no build step or server needed. The UI picks Chinese or English from the browser, and you can switch any time at the top right.

Deployment: a push to `main` publishes `site/` to GitHub Pages (`.github/workflows/pages.yml`); the custom domain lives in `site/CNAME`.

## Sources & shelf life

Facts are current as of mid-2026. This corner of software moves fast — re-check feature / version claims against the official pages. Known source caveats are in Chapter 34 (on the site).

## License

Handbook text © 2026 yinxinghan.com. Short quotations from vendor blogs remain the property of their authors and are used for educational citation.
