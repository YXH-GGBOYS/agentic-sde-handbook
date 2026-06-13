# Agentic 软件工程手册

[English](README.md) · **中文**

一份面向 AI 与 coding agent 时代的软件工程（SDE）与项目管理手册——10 卷 34 章，中英双语平行。

**在线：** https://sde.yinxinghan.com

每个核心概念都按「生活类比 → 工程定义 → 真实案例」三段式展开。事实以 GitHub / OpenAI / Anthropic 官方材料为准（一手），辅以明确标注的二手分析，每条都挂可点击的来源。

## 本地预览

纯静态、离线可用、无需起服务——直接用浏览器打开 `site/index.html`。界面会按浏览器语言自动选择（中文浏览器显示中文，其余显示英文），右上角随时可切换。

## 结构

```
site/                  可发布的静态站点
  index.html
  assets/              样式、脚本、vendored 库（marked / highlight.js）、封面、favicon
  content.js           由 build.py 从 markdown 生成的内容包
book/
  content/zh/          中文各章真源（一文件一章）
  content/en/          英文平行真源（同名对应）
  TOC.md               细化目录
research/
  sources_index.json   来源索引数据
```

## 重建

内容真源是 `book/content/` 里的 markdown。改完任意章节后，重新生成站点内容包：

```bash
python3 site/build.py
```

## 部署

推送后，`.github/workflows/pages.yml` 会自动把 `site/` 发布到 GitHub Pages；自定义域名见 `site/CNAME`。

## 来源与时效

事实截至 **2026-06-13**。coding agent 领域迭代极快，涉及具体功能 / 价格 / 版本的判断请对照官方页复核；已知的来源瑕疵与待核查项见第 34 章。

## 许可

教材内容 © 2026 yinxinghan.com。文中对各厂商博客的简短引用版权归原作者所有，仅作教学引用。
