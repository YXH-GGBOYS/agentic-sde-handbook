#!/usr/bin/env python3
"""Build the handbook site: read book/content/{zh,en}/*.md + research/sources_index.json,
emit site/content.js as `window.BOOK = {...}` so the site works offline from file://."""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZH = os.path.join(ROOT, 'book', 'content', 'zh')
EN = os.path.join(ROOT, 'book', 'content', 'en')
SRC = os.path.join(ROOT, 'research', 'sources_index.json')
OUT = os.path.join(ROOT, 'site', 'content.js')

META = {
    'eyebrow': 'AGENTIC SOFTWARE ENGINEERING · 2026',
    'title_zh': 'Agentic 软件工程手册',
    'title_en': 'The Agentic Software Engineering Handbook',
    'tagline_zh': '从"会写代码"到"设计、约束、验证、治理一套软件交付系统"。面向资深 SDE、技术负责人与架构师；以一手来源为事实基础。',
    'tagline_en': 'From writing code to designing, constraining, verifying, and governing a software-delivery system. For senior SDEs, tech leads, and architects — grounded in first-party sources.',
    'metaphor': [
        {'k_zh': 'AGENTS.md / CLAUDE.md', 'k_en': 'AGENTS.md / CLAUDE.md', 'zh': '冰箱上的家规便条', 'en': 'a note stuck on the fridge'},
        {'k_zh': 'harness 工程', 'k_en': 'harness engineering', 'zh': '工位 + 工具 + 门禁 + 隔离操作间 + 验收员 + 撤回键', 'en': 'the workstation, tools, access, isolated room, inspector, undo button'},
        {'k_zh': 'context 工程', 'k_en': 'context engineering', 'zh': '派活前把该交代的背景备齐', 'en': 'brief the background before you hand off'},
        {'k_zh': 'tool 工程', 'k_en': 'tool engineering', 'zh': '工具顺手、标签清楚、危险的锁起来', 'en': 'tools within reach, clearly labeled, dangerous ones locked'},
        {'k_zh': 'sandbox / 权限', 'k_en': 'sandbox / permissions', 'zh': '隔离操作间 + 门禁分级', 'en': 'an isolated room + tiered access'},
        {'k_zh': 'eval', 'k_en': 'eval', 'zh': '试用期考核：看真实任务，不是面试 demo', 'en': 'a probation review — real tasks, not the interview demo'},
        {'k_zh': 'trace', 'k_en': 'trace', 'zh': '监控录像 / 工作留痕', 'en': 'the security-camera footage / work log'},
        {'k_zh': '多 agent', 'k_en': 'multi-agent', 'zh': '一个班组多个外包：分工，别同时凿一面墙', 'en': "a crew of contractors: divide work, don't chisel the same wall"},
    ],
}


def parse_frontmatter(text):
    """Minimal YAML-ish frontmatter parser for our limited schema."""
    meta, body = {}, text
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n?(.*)$', text, re.S)
    if not m:
        return meta, text
    fm, body = m.group(1), m.group(2)
    for line in fm.splitlines():
        if not line.strip() or ':' not in line:
            continue
        k, v = line.split(':', 1)
        k, v = k.strip(), v.strip()
        if v.startswith('[') and v.endswith(']'):
            inner = v[1:-1].strip()
            meta[k] = [x.strip().strip('"\'') for x in inner.split(',') if x.strip()] if inner else []
        else:
            meta[k] = v.strip('"\'')
    return meta, body.strip()


def load_dir(d):
    out = {}
    if not os.path.isdir(d):
        return out
    for fn in os.listdir(d):
        if not fn.endswith('.md'):
            continue
        meta, body = parse_frontmatter(open(os.path.join(d, fn), encoding='utf-8').read())
        cid = meta.get('id') or fn[:-3]
        out[cid] = {'meta': meta, 'body': body, 'file': fn}
    return out


def main():
    zh, en = load_dir(ZH), load_dir(EN)
    chapters = []
    for cid, z in zh.items():
        m = z['meta']
        e = en.get(cid, {})
        try:
            order = int(m.get('order', 999))
        except ValueError:
            order = 999
        chapters.append({
            'id': cid,
            'order': order,
            'part_zh': m.get('part_zh', ''),
            'part_en': m.get('part_en', m.get('part_zh', '')),
            'title_zh': m.get('title_zh', cid),
            'title_en': m.get('title_en', m.get('title_zh', cid)),
            'sources': m.get('sources', []),
            'zh': z['body'],
            'en': e.get('body', z['body']),
        })

    # group by part, preserve order
    parts_map = {}
    for c in chapters:
        key = c['part_zh']
        parts_map.setdefault(key, {'part_zh': c['part_zh'], 'part_en': c['part_en'], 'chapters': []})
        parts_map[key]['chapters'].append(c)
    parts = list(parts_map.values())
    for p in parts:
        p['chapters'].sort(key=lambda c: c['order'])
    parts.sort(key=lambda p: min(c['order'] for c in p['chapters']))

    sources = []
    if os.path.exists(SRC):
        for s in json.load(open(SRC, encoding='utf-8')):
            sources.append({'id': s['id'], 'org': s.get('org', ''), 'title': s.get('title', ''),
                            'url': s.get('url', ''), 'date': s.get('date', ''), 'tier': s.get('tier', '')})

    book = {'meta': META, 'parts': parts, 'sources': sources,
            'built': '2026-06-13', 'chapter_count': len([c for c in chapters if c['id'] != 'home'])}
    js = 'window.BOOK = ' + json.dumps(book, ensure_ascii=False) + ';\n'
    open(OUT, 'w', encoding='utf-8').write(js)
    print('built %s  (%d parts, %d chapters, %d sources)' % (
        OUT, len(parts), book['chapter_count'], len(sources)))


if __name__ == '__main__':
    main()
