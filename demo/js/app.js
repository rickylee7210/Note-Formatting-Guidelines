// ===== 示例内容 =====
const SAMPLES = {
mixed: `# 项目周报：AI 笔记功能迭代

本周完成了笔记详情页的 Markdown 渲染优化，以下是关键进展。

## 一、功能进展

### 1.1 排版规范落地

我们基于 HyperOS 设计系统，完成了 Markdown 排版规范 v2.1 的制定。规范覆盖了以下元素：

- 标题层级（H1-H3 + PageTitle）
- 正文、**加粗**、*斜体*、~~删除线~~、==高亮==、<u>下划线</u>
- \`行内代码\` 和代码块
- [链接样式](https://example.com)

#### 字号阶梯验证

H4 标题（16dp/450）与 H3（18dp）有明显字号差异，与正文（16dp/330）靠字重区分。

##### 五级标题示例

H5 与 H4 视觉一致，移动端扁平策略。

###### 六级标题示例

H6 同样统一为 heading.minor 样式。

### 1.2 多来源内容一致性

| 内容来源 | 格式特点 | 处理方式 |
|---------|---------|---------|
| 用户手写 | 简单格式为主 | 直接渲染 |
| AI 生成 | 格式丰富，含表格/代码 | 统一 Token 渲染 |
| 外部导入 | 可能含 HTML | 降级 + 过滤 |

### 1.3 代码块示例

\`\`\`javascript
function renderMarkdown(content) {
  const md = markdownit({
    html: false,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value;
      }
      return '';
    }
  });
  return md.render(content);
}
\`\`\`

## 二、待办事项

- [x] 完成排版规范文档
- [x] 构建 Demo 验证页
- [ ] 确认语法高亮配色方案
- [ ] 研发评审规范文档

## 三、引用与备注

> 设计的本质不是让东西好看，而是让东西好用。
> 在移动端场景下，行高需要比桌面端略大，因为屏幕较窄，视线换行频率高。

---

下周计划：推动研发按规范实现，跟进 Dark 模式适配。

![示例图片](../Image%20test.png)

`,

user: `# 读书笔记：设计心理学

今天读了 Don Norman 的《设计心理学》第三章，记几个要点。

## 核心概念

**可供性**（Affordance）：物品的特性决定了它可能的操作方式。比如门把手的形状暗示你该推还是拉。

**示能**和**意符**是两个不同的概念：
- 示能是物品本身的属性
- 意符是告诉用户该怎么操作的信号

## 我的思考

好的设计应该是不言自明的。如果一个产品需要说明书才能用，那设计就是失败的。

这让我想到我们的笔记产品——用户不应该需要学习 Markdown 语法才能写出好看的笔记。排版应该是自动的、舒适的。

## 金句摘录

> 好的设计实际上比糟糕的设计更难被注意到，因为好的设计如此契合我们的需要，以至于它变得不可见。

---

明天继续读第四章。
`,

ai: `# 2026 年移动端笔记应用趋势分析

## 概述

移动端笔记应用正在经历从"文本编辑器"到"知识管理平台"的转型。本文分析了当前主要技术趋势及其对产品设计的影响。

## 关键趋势

### 1. AI 原生内容生成

现代笔记应用正在将 AI 能力深度集成到编辑流程中：

| 能力 | 传统方式 | AI 增强方式 | 用户价值 |
|------|---------|-----------|---------|
| 内容创建 | 手动输入 | 语音转文字 + AI 润色 | 效率提升 3-5x |
| 格式整理 | 手动排版 | 自动结构化 | 零学习成本 |
| 知识关联 | 手动标签 | 语义自动关联 | 发现隐藏联系 |
| 内容摘要 | 手动提炼 | AI 自动摘要 | 快速回顾 |

### 2. 跨平台渲染一致性

确保内容在不同设备和平台上呈现一致的阅读体验，是当前的核心技术挑战。关键技术方案包括：

1. **Design Token 体系**：将设计参数抽象为语义化变量
2. **CSS Custom Properties**：实现运行时主题切换
3. **Markdown 作为中间协议**：统一内容的存储和传输格式

\`\`\`css
/* Design Token 示例 */
:root {
  --font-size-body: 16px;
  --line-height-body: 25.6px;
  --color-text-primary: rgba(0, 0, 0, 0.9);
}
\`\`\`

### 3. 性能优化策略

对于长文档场景（>1000 行），推荐以下优化策略：

- **虚拟滚动**：只渲染可视区域内的内容
- **增量解析**：仅重新解析变更的段落
- **图片懒加载**：进入视口时才加载图片资源

> **注意**：在 WebView 环境中，JavaScript 执行性能通常比原生浏览器低 20-30%。需要特别关注首屏渲染时间。

## 结论

- [x] Design Token 体系是解决跨平台一致性的最佳实践
- [x] AI 内容生成需要配套的排版规范
- [ ] 长文档性能优化需要进一步验证
- [ ] 离线场景的内容同步策略待定

---

*本分析基于 2026 年 Q1 的市场调研数据。*
`,

"import": `# Meeting Notes - Product Review

## Attendees

**Present:** Alice, Bob, Charlie, Diana
**Absent:** Eve (on leave)

## Agenda

### 1. Q4 Roadmap Review

The team reviewed the Q4 roadmap. Key highlights:

- Feature A is **on track** for November release
- Feature B has been ~~deprioritized~~ moved to Q1
- Feature C needs additional <u>design review</u>

### 2. Technical Discussion

Charlie presented the new rendering engine benchmarks:

\`\`\`python
# Benchmark results
results = {
    "markdown_parse": "12ms avg",
    "dom_render": "8ms avg",
    "total_ttfp": "20ms avg"  # Time to First Paint
}

for metric, value in results.items():
    print(f"{metric}: {value}")
\`\`\`

Performance comparison across platforms:

| Platform | Parse Time | Render Time | Total |
|:---------|:----------:|------------:|------:|
| iOS | 10ms | 6ms | 16ms |
| Android | 14ms | 10ms | 24ms |
| Web | 12ms | 8ms | 20ms |

### 3. Action Items

- [ ] Alice: Update design specs by Friday
- [ ] Bob: Set up A/B test framework
- [x] Charlie: Share benchmark code
- [ ] Diana: Schedule user interviews

> **Decision:** We will proceed with the unified rendering approach.
> All platforms will use the same CSS Token system.

### 4. Next Steps

1. Design review scheduled for **next Tuesday**
2. Engineering sprint starts **November 1st**
3. Beta release target: **November 15th**

---

*Notes taken by Diana. Please review and add corrections.*

![Architecture Diagram](https://via.placeholder.com/600x300/e8e8e8/666?text=Architecture+Diagram)
`
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('markdownInput');
  const preview = document.getElementById('preview');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const highlightLink = document.getElementById('highlight-theme');

  // markdown-it 配置
  const md = window.markdownit({
    html: true,
    breaks: true,
    linkify: true,
    typographer: false,
    highlight: function (str, lang) {
      if (lang && window.hljs && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
        } catch (_) {}
      }
      return '';
    }
  });

  // 插件
  if (window.markdownitTaskLists) {
    md.use(window.markdownitTaskLists, { enabled: false, label: true });
  }
  if (window.markdownitMark) {
    md.use(window.markdownitMark);
  }

  // 渲染
  let userEdited = false;
  function render() {
    // 用户手动编辑时才保留连续空行，预设示例按原始 markdown 渲染
    let text = input.value;
    if (userEdited) {
      const lines = text.split('\n');
      text = lines.map((line, i) => {
        // 当前行是空行，且前一行也是空行 → 填零宽空格产生额外 <br>
        // 第一个空行保留原样，让 markdown-it 正常识别段落分隔
        if (/^[ \t]*$/.test(line) && i > 0 && /^[ \t]*$/.test(lines[i - 1])) {
          return '\u200B';
        }
        return line;
      }).join('\n');
    }
    preview.innerHTML = md.render(text);
    // 给已完成的任务项加 class，用于文字变淡
    preview.querySelectorAll('.task-list-item').forEach(li => {
      const cb = li.querySelector('.task-list-item-checkbox');
      if (cb && cb.checked) {
        li.classList.add('task-checked');
      }
    });
    // 图片加载失败态：显示 alt 文字 + 占位图标
    preview.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function () {
        this.classList.add('img-error');
        this.setAttribute('alt', this.getAttribute('alt') || '图片加载失败');
      }, { once: true });
    });
    // 表格横向滚动 wrapper
    preview.querySelectorAll('table').forEach(table => {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
    // 中英文混排自动间距（CSS text-autospace fallback）
    if (!CSS.supports('text-autospace', 'ideograph-alpha ideograph-numeric')) {
      const CJK = /[\u2E80-\u9FFF\uF900-\uFAFF]/;
      const LATIN = /[A-Za-z0-9\u00C0-\u024F]/;
      const walk = document.createTreeWalker(preview, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      while (walk.nextNode()) nodes.push(walk.currentNode);
      nodes.forEach(node => {
        const text = node.nodeValue;
        if (!text || text.trim().length === 0) return;
        let result = '';
        for (let i = 0; i < text.length; i++) {
          result += text[i];
          if (i < text.length - 1) {
            const curr = text[i], next = text[i + 1];
            if ((CJK.test(curr) && LATIN.test(next)) || (LATIN.test(curr) && CJK.test(next))) {
              result += '\u200A'; // hair space (thin space for CJK-Latin gap)
            }
          }
        }
        if (result !== text) {
          node.nodeValue = result;
        }
      });
    }
  }

  input.addEventListener('input', () => { userEdited = true; render(); });

  // 示例切换
  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sample-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.sample;
      input.value = SAMPLES[key] || '';
      userEdited = false;
      render();
    });
  });

  // 主题切换
  let isDark = false;
  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
    themeIcon.textContent = isDark ? '🌙' : '☀️';
    highlightLink.href = isDark ? 'css/highlight-dark.css' : 'css/highlight-light.css';
  });

  // 加载默认示例
input.value = SAMPLES.mixed;
  render();
});
