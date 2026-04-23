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

  // 页面元信息（日期时间）
  const pageMeta = document.getElementById('pageMeta');
  if (pageMeta) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    pageMeta.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${h}:${m}`;
  }

  // 加载默认示例
  input.value = SAMPLES.mixed;
  render();
});
