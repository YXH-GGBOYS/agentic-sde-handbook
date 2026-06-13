# Agentic SDE Handbook · Agentic 软件工程手册

AI 与 coding agent 时代的软件工程（SDE）与项目管理深度教学材料。中英双语，10 卷 34 章。
A bilingual (中文 / English) handbook on software engineering and project management in the age of coding agents — 34 chapters across 10 parts.

**在线 / Live:** https://sde.yinxinghan.com

每个核心概念都按「生活类比 → 工程定义 → 真实案例」三段式展开；事实以 GitHub / OpenAI / Anthropic 官方材料为准（一手），辅以明确标注的二手分析，每条都挂可点击的来源。
Every concept follows the same three beats — *everyday analogy → engineering definition → real case*. Facts are grounded in first-party GitHub / OpenAI / Anthropic material, with clearly-marked secondary analysis; each carries a clickable source.

## 本地预览 / Local preview

纯静态、离线可用、无需起服务——直接用浏览器打开：
Pure static, offline, no server — just open in a browser:

```
site/index.html
```

右上角切换 **中文 / English**；左栏是目录；顶栏可搜索；**Sources** 页是完整来源索引。
Toggle **中文 / English** top-right; the left rail is the table of contents; search is in the top bar; the **Sources** page is the full index.

## 结构 / Structure

```
site/                  可发布的静态站点 / the publishable static site
  index.html
  assets/              样式、脚本、vendored 库（marked / highlight.js）
  content.js           由 build.py 从 markdown 生成的内容包
book/
  content/zh/          各章中文真源（与 en 同名一一对应）
  content/en/          parallel English source, one file per chapter
  TOC.md               细化目录 / detailed table of contents
research/
  sources_index.json   来源索引数据 / source-index data
```

## 重建 / Rebuild

内容真源是 `book/content/` 里的 markdown。改完任意章节后，重新生成站点内容包：
The source of truth is the markdown in `book/content/`. After editing any chapter, regenerate the site bundle:

```bash
python3 site/build.py
```

## 部署 / Deploy

推到 GitHub 后，`.github/workflows/pages.yml` 会自动把 `site/` 发布到 GitHub Pages；
自定义域名见 `site/CNAME`。On push, the included Actions workflow publishes `site/` to GitHub Pages; the custom domain lives in `site/CNAME`.

## 来源与时效 / Sources & shelf life

事实截至访问日期 **2026-06-13**。coding agent 领域迭代极快，涉及具体功能/价格/版本的判断请对照官方页复核；已知的来源瑕疵与待核查项见第 34 章。
Facts are current as of **2026-06-13**; this corner of software moves fast — re-check feature/price/version claims against the official pages. Known source caveats are in Chapter 34.

## License

教材内容 © 2026 yinxinghan.com，保留权利。文中对各厂商博客的简短引用，版权归原作者所有，仅作教学引用。
Handbook text © 2026 yinxinghan.com. Short quotations from vendor blogs remain the property of their authors and are used for educational citation.
