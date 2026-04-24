# 笔记详情页 Markdown 排版规则规范-正式版

> 基于 HyperOS 设计系统，适用于移动端笔记详情页的 Markdown 渲染规范。

**目标：让 Markdown 成为「设计 → 研发 → AI」的统一中间协议**

不管用户自己写入的内容、AI 生成的内容、还是从其他渠道导入的内容，都遵循同一套排版规范，在笔记详情页 WebView 中呈现一致的阅读体验。

---

### 🧭 设计原则

以下 7 条原则是本规范所有细节决策的判断依据。遇到规范未覆盖的场景，按这些原则推导。

**1. Markdown 是协议，不是格式**

用户手写、AI 生成、外部导入——三种来源同一套渲染规则，视觉零差异。Markdown 在这里不是「一种文本格式」，而是设计、研发、AI 之间的统一中间协议。

> 支撑决策：目标声明「设计 → 研发 → AI 的统一中间协议」；通用降级规则对所有来源一视同仁。

**2. Token 驱动，禁止硬编码**

所有样式值通过语义 Token 引用，不允许出现裸数值。改一个 Token，全局生效。这是整套规范可维护、可扩展的基础。

> 支撑决策：整体架构关键原则「❌ 不允许直接写硬编码数值」；第八章 CSS Token 速查表是唯一数值来源。

**3. 扁平优于层级**

移动端屏幕窄，层级越深越难读。结构上只保留必要的一层区分，多余层级视觉打平。

> 支撑决策：H4-H6 统一为 heading.minor 样式；引用不嵌套，多层 `>` 渲染为单层；列表 CSS 扁平化处理。

**4. 内容不可丢失**

任何无法识别的语法、标签、嵌套，都降级为纯文本显示，绝不吞掉用户内容。宁可丑，不可丢。

> 支撑决策：通用降级规则「以纯文本显示，不丢失内容」；异常内容处理章节的逐项降级策略。

**5. 对齐即秩序**

换行文字对齐首行文字（悬挂缩进），不同列表类型的文字起始位置一致，标记符号与首行文字垂直居中。对齐是视觉秩序的基础。

> 支撑决策：悬挂缩进规则；三种列表（无序/有序/任务）间距统一；圆点与 checkbox 垂直居中对齐；标题级别列表（data-heading）中 bullet/checkbox 随字号等比缩放，仍保持垂直居中。

**6. 系统承担复杂性**

用户只管写内容，排版、间距、对齐、模式切换全部由系统自动处理。用户不需要知道 Token 是什么。

> 支撑决策：PageTitle 由系统注入不走 Markdown；中英文间距自动插入；代码块横向滚动边距由 CSS 保证；块编辑器通过 `data-*` 属性（heading、bold、indent）自动管理标题级别、加粗切换、缩进层级，用户无需手写属性。

**7. Light/Dark 是同一套设计**

暗黑模式不是「反色」，是独立设计的配色方案，通过同一套 Token 结构切换，视觉权重保持一致。

> 支撑决策：每个颜色 Token 都有 Light/Dark 对；模式切换过渡动画 0.3s ease；暗黑模式独立色值而非简单反转。

---

### 📋 研发快速导航

| 你想知道 | 去哪看 |
|---------|--------|
| 这份规范管什么、不管什么？ | → 第一章「范围边界」 |
| 每个 Markdown 元素对应什么 UI 组件？ | → 第六章「组件映射表」 |
| CSS 变量直接对照实现 | → 第八章「CSS Token 速查表」（唯一数值来源） |
| 边界情况怎么处理？ | → 第七章第 3 节「异常内容处理」 |
| 实现完怎么验收？ | → 第九章「验收标准」 |

---

## 一、范围边界与整体架构

### 本规范的范围

本规范定义笔记详情页中 **Markdown 内容的渲染样式**。以下内容类型**不走 Markdown 渲染管线**，由独立卡片组件处理：

- 网页卡片
- AI 录音卡片
- 涂鸦卡片
- AI生成的待办卡片
- 附件卡片
- 思维导图卡片

卡片类型的检测与路由不在本规范范围内，由上游模块负责。本规范只管「确认为 Markdown 内容后，怎么渲染」。

### 通用降级规则

当渲染层遇到本规范未定义的 Markdown 元素或 HTML 标签时，统一降级为最接近的已定义元素。无法匹配任何已定义元素的内容，以纯文本（text.primary）显示，不丢失内容。

### 整体架构

```
Semantic Layer（语义层）
↓
Typography Layer（字体系统）
↓
Layout Layer（间距系统）
↓
Color Layer（颜色系统，含暗黑模式）
↓
Component Mapping（组件映射）
↓
Markdown Mapping（AI/文档协议）
```

**关键原则：**
- ❌ 不允许直接写硬编码数值（如 "16dp"）
- ✅ 必须使用语义 Token（如 `text.primary`）
- 所有 CSS 变量采用 CSS Custom Properties 形式（如 `--color-text-primary`），下文统称「CSS Token」

---

## 二、Semantic Token（语义层）

| 分类 | 名称 | Token | 含义 | 使用场景 |
|------|------|-------|------|----------|
| 系统标题 | 页面标题 (PageTitle) | heading.page | 页面标题 | 页面唯一主标题，**由系统注入，不走 Markdown 解析** |
| 系统标题 | 页面元信息 (PageMeta) | text.secondary | 创建/修改时间 | PageTitle 下方，**由系统注入，不走 Markdown 解析** |
| 内容标题 | 一级标题 (H1) | heading.section | 模块标题 | Markdown `#` |
| 内容标题 | 二级标题 (H2) | heading.subsection | 子模块 | Markdown `##` |
| 内容标题 | 三级标题 (H3) | heading.caption | 辅助标题 | Markdown `###` |
| 内容标题 | 四~六级标题 (H4-H6) | heading.minor | 次级辅助标题 | Markdown `####` `#####` `######` |
| 基础文本 | 正文 | text.primary | 主文本 | 正文段落 |
| 基础文本 | 注释/辅助 | text.secondary | 次级文本 | 注释、caption、脚注 |
| 样式-强调 | 加粗 | text.emphasis | 强调 | `**text**` |
| 样式-强调 | 斜体 | text.italic | 斜体 | `*text*`（不推荐中文使用） |
| 样式-强调 | 行内代码 | text.code | 代码/术语 | `` `code` `` |
| 样式-强调 | 高亮 | text.highlight | 高亮标记 | `==text==`（自定义扩展，见备注） |
| 样式-强调 | 删除线 | text.strike | 删除 | `~~text~~` |
| 链接 | 链接文字 | text.link | 可点击文字 | `[text](url)` |
| 区块 | 引用 | block.quote | 引用 | `>` |
| 区块 | 有序/无序列表 | block.list | 列表 | `- ` / `1. ` |
| 区块 | 任务列表 | block.task | 任务项 | `- [ ]` / `- [x]` |
| 区块 | 列表标题样式 | block.list.heading | 标题级别列表 | `<div data-heading="hN">` 包裹的列表，继承对应标题的字号/字重/行高 |
| 区块 | 分割线 | block.divider | 分割 | `---` |
| 区块 | 表格 | block.table | 数据表格 | Markdown table 语法 |
| 媒体 | 图片 | media.image | 图片内容 | `![alt](url)` |

> **备注：PageTitle 与 H1 的区分**
> PageTitle 是系统层注入的页面大标题，不出现在 Markdown 正文内容中。Markdown 正文中的 `#` 始终映射为 H1（heading.section）。两者完全解耦，研发无需做消歧处理。

> **备注：`==text==` 高亮语法**
> 这是非标准 Markdown 扩展语法。从其他编辑器导入的内容可能不包含此语法。Fallback 规则：无法识别时以纯文本显示，不丢失内容。

---

## 三、Typography Token（字体系统）

### 1. 字号 & 字重体系

| 语义 | 字号 | 字重 | 行高倍数 | 行高计算值 |
|------|------|------|----------|-----------|
| heading.page (PageTitle) | 26dp | Semibold-520 | 1.3x | 33.8dp |
| heading.section (H1) | 22dp | Demibold-450（默认）/ Medium-380（取消加粗） | 1.35x | 29.7dp |
| heading.subsection (H2) | 20dp | Demibold-450（默认）/ Medium-380（取消加粗） | 1.4x | 28dp |
| heading.caption (H3) | 18dp | Demibold-450（默认）/ Medium-380（取消加粗） | 1.45x | 26.1dp |
| heading.minor (H4-H6) | 16dp | Demibold-450 | 1.5x | 24dp |
| text.primary (正文) | 16dp | Regular-330 | 1.6x | 25.6dp |
| text.emphasis (加粗) | 16dp | Demibold-450 | 1.6x | 25.6dp |
| text.secondary (辅助) | 13dp | Regular-330 | 1.2x | 15.6dp |
| text.code (代码) | 15dp | Regular-330 | 1.2x | 16.8dp |
| text.link (链接) | 16dp | Medium-380 | 1.6x | 25.6dp |
| block.table (表格正文) | 16dp | Regular-330 | 1.6x | 25.6dp |
| block.table.header (表头) | 16dp | Regular-330 | 1.6x | 25.6dp |
| media.image.caption (图注) | 13dp | Regular-330 | 1.2x | 15.6dp |

### 2. 行高计算规则

**公式：L = F × M**
- *L*：行高 (Line Height)
- *F*：当前字号 (Font Size)
- *M*：行高倍数 (Multiplier)

| 类型 | 倍数范围 | 说明 |
|------|----------|------|
| 正文 (Body) | 1.6 | 移动端长文阅读黄金比例 |
| 标题 (Headings) | 1.3 ~ 1.5 | 标题字号大，倍数过大会视觉松散 |
| 代码/辅助信息 | 1.2 | 紧凑排列 |

> **行高不强制对齐 8dp 网格。** 行高是排版属性，非布局间距，由 fontSize × multiplier 精确计算。

### 3. 字体规范

| 字体名称 | 类型 | 版本 | 用途 |
|----------|------|------|------|
| MiSans | 简体中文 | Version 4.009 | 正文、标题 |
| MiSans Latin | 英文 | Version 4.007 | 英文、数字 |
| Monospace (系统等宽) | 代码 | — | 代码块、行内代码 |

---

## 四、Layout Token（间距系统）

### 1. 统一 8dp 体系

| Token | 数值 | 常用场景 |
|-------|------|----------|
| xs | 4dp | 微调间距 |
| sm | 8dp | 列表项间距、标题下间距（小） |
| md | 12dp | 段落间距、代码块 padding、标题下间距（大） |
| lg | 16dp | 列表缩进、页面左右 padding |
| xl | 24dp | 模块间距 |
| xxl | 32dp | 大模块分隔 |

### 2. 语义间距规则

| 场景 | 间距 Token | 数值 |
|------|-----------|------|
| 段落间距 | md | 12dp |
| PageTitle → PageMeta | sm | 8dp |
| PageMeta → 正文内容 | xl | 24dp |
| 模块间距（标题前） | xl | 24dp |
| 标题下间距 | sm ~ md | 8 ~ 12dp |
| 列表项间距 | sm | 8dp |
| 代码块 padding | lg | 16dp |
| 表格单元格 padding | md | 12dp |
| 图片上下间距 | md | 12dp |
| 引用块 padding-left | lg | 16dp |
| 引用块左边距 | — | 2dp（硬编码微调） |

### 3. 列表缩进规则

```
悬挂缩进：标记绝对定位，文字通过 padding-left 缩进，换行后文字与首行文字对齐
无序/有序列表 padding-left = calc(1em + lg) = 32dp
任务列表 padding-left = calc(checkbox-size + lg)
  - 默认 (body/H4-H6): calc(18dp + 16dp) = 34dp
  - H3: calc(20dp + 16dp) = 36dp
  - H2: calc(22dp + 16dp) = 38dp
  - H1: calc(24dp + 16dp) = 40dp
标记到文字间距 = lg (16dp)，三种列表统一
圆点垂直居中 = calc((li-line-height - bullet-size) / 2)
checkbox 垂直居中 = calc((li-line-height - checkbox-size) / 2)
嵌套缩进（从第2级起，标记与上一级文字左边缘对齐，最大5级，第6级起停止缩进）：
  - 嵌套列表 padding-left = 0，标记自然落在上一级文字起始位置
  - 每级实际偏移量 = li 的 padding-left（无序/有序均为 calc(1em + 16dp) ≈ 32dp）
  - 混合嵌套同理，有序套无序、无序套有序均遵循此规则
```

### 4. 响应式规则

| 屏幕类型 | 宽度 | 规则 |
|----------|------|------|
| 标准屏 | ≥600dp | 阅读区域 max-width 720dp，左右 padding lg(16dp) |
| 紧凑屏 (compact) | <600dp | 字号不变，间距缩减一级（xl→lg, lg→md, md→sm） |

---

## 五、Color Token（支持暗黑模式）

颜色具体数值见第八章「CSS Token 速查表」（唯一数值来源）。本章定义语义映射关系。

### 1. 语义颜色映射

| 名称 | 语义 Token | 说明 |
|------|-----------|------|
| PageTitle | heading.page | 标题纯色 |
| H1 / H2 / H3 | heading.section / .subsection / .caption | 标题纯色 |
| H4-H6 | heading.minor | 标题纯色 |
| 正文 | text.primary | 主文本，带透明度 |
| 注释/辅助 | text.secondary | 次级文本，低透明度 |
| 行内代码 | text.code | 中等透明度 |
| 链接 | text.link | 笔记主题色 #FFBB0F，用于一切可跳转内容 |
| 链接点击态 | text.link.active | 主题色 + opacity 0.7 |
| 代码块背景 | code.bg | 极低透明度背景 |
| 分割线 | block.divider | 低透明度边框 |
| 引用文字 | block.quote | #000000 (Alpha 60%) / Dark: #FFFFFF (Alpha 60%) |
| 引用左边框 | block.quote.border | #000000 (Alpha 40%) / Dark: #FFFFFF (Alpha 40%)，宽度 2dp |
| 表格边框 | block.table.border | #E5E5E5 / Dark: #262626（不使用透明度） |
| 表头背景 | block.table.header.bg | 极低透明度背景 |
| 任务列表选中 | block.task.checked | rgba(0, 0, 0, 0.2) / Dark: rgba(255, 255, 255, 0.2)，描边透明不叠加 |
| 任务列表未选中 | block.task.unchecked | rgba(0, 0, 0, 0.2) / Dark: rgba(255, 255, 255, 0.2) |
| 已完成任务文字 | block.task.checked-text | #000000 (Alpha 30%) / Dark: #FFFFFF (Alpha 30%) |

### 2. 模式切换

Dark 模式切换过渡动画：`transition: color 0.3s ease, background-color 0.3s ease`

---

## 六、Component Mapping（组件映射）

### 1. Markdown × UI 组件 × Token 映射表

| 名称 | Markdown 语法 | UI 组件 | Design Token |
|------|-------------|---------|-------------|
| 页面标题 (PageTitle) | 系统注入（不走 Markdown） | PageHeader | heading.page |
| 页面元信息 (PageMeta) | 系统注入（不走 Markdown） | PageMeta | text.secondary |
| 一级标题 (H1) | `#` | Header1 | heading.section |
| 二级标题 (H2) | `##` | Header2 | heading.subsection |
| 三级标题 (H3) | `###` | Header3 | heading.caption |
| 四~六级标题 (H4-H6) | `####` `#####` `######` | Header4 | heading.minor |
| 正文 (Body) | （无标记） | TextView | text.primary |
| 辅助 (注释) | `[^1]` 或特定语法 | Caption | text.secondary |
| 高亮 (Mark) | `==text==` | MarkerView | text.highlight |
| 行内代码 (Code) | `` `code` `` | InlineCode | text.code |
| 加粗 (Bold) | `**text**` | StrongText | text.emphasis |
| 斜体 (Italic) | `*text*` | EmphasisText | text.italic |
| 下划线 (Underline) | `<u>text</u>` | UnderlineText | text.primary + underline |
| 删除线 (Strike) | `~~text~~` | StrikeText | text.strike |
| 链接 (Link) | `[text](url)` | LinkText | text.link |
| 图片 (Image) | `![alt](url)` | ImageView | media.image |
| 引用 (Quote) | `>` | Blockquote | block.quote |
| 无序列表 (Unordered) | `- ` 或 `* ` | UnorderedList | block.list.unordered |
| 有序列表 (Ordered) | `1. ` | OrderedList | block.list.ordered |
| 任务列表 (Task) | `- [ ]` / `- [x]` | TaskList | block.task |
| 列表标题样式 (Heading List) | `<div data-heading="hN">` 包裹列表 | HeadingList | block.list.heading |
| 标题加粗切换 (Heading Bold Toggle) | `<hN data-bold="false">` | HeaderN | heading.section/.subsection/.caption |
| 表格 (Table) | `\| ... \|` | TableView | block.table |
| 分割线 (Divider) | `---` | HorizontalRule | block.divider |
| 代码块 (Code Block) | ` ``` ` | CodeBlock | text.code + code.bg |
| 向右缩进 | Tab / Space | IndentationGroup | layout.indent |
| 向左缩进 | Shift+Tab | IndentationGroup | layout.outdent |
| 居左对齐 | `<div align="left">` | TextAlignLeft | layout.align.left |
| 居中对齐 | `<center>` | TextAlignCenter | layout.align.center |
| 居右对齐 | `<div align="right">` | TextAlignRight | layout.align.right |

### 2. 组件细节

#### Quote（引用块）

| 属性 | 值 |
|------|-----|
| 左边框宽度 | 2dp |
| 左边框颜色 | --color-border-quote：#000000 (Alpha 40%) / Dark: #FFFFFF (Alpha 40%) |
| 左边框高度 | 仅覆盖文字区域，不含行高（通过 `::before` 绝对定位，上下各裁掉 `(line-height - font-size) / 2`） |
| 背景 | 无 |
| 文字颜色 | #000000 (Alpha 60%) / Dark: #FFFFFF (Alpha 60%) |
| margin-left | 2dp（硬编码微调，引用线不完全贴边） |
| padding-left | lg (16dp) |
| 嵌套规则 | 不允许嵌套引用，嵌套的引用块视觉上打平，只有「引用/不引用」两种状态 |

#### Code Block（代码块）

| 属性 | 值 |
|------|-----|
| 字体 | Monospace（系统等宽字体） |
| 字号 | 15dp |
| 行高 | 1.2x (16.8dp) |
| 文字颜色 | text.code：#000000 (Alpha 60%) / Dark: #FFFFFF (Alpha 60%) |
| 背景 | code.bg |
| padding | lg (16dp)，上下由 `pre` 控制，左右由 `pre code` 控制（确保横向滚动时左右边距不塌陷） |
| 圆角 | 8dp |
| 语法高亮 | 不支持彩色语法高亮，代码块内所有文本统一使用 text.code 色值 |

#### List（列表）

| 属性 | 值 |
|------|-----|
| 行高 | 默认 text.primary 同款 25.6dp；data-heading 模式下继承对应标题行高（见 Heading List） |
| 项间距 | sm (8dp) |
| 悬挂缩进 | 标记绝对定位 + li 的 padding-left 腾出标记空间，换行文字与首行文字对齐 |
| 无序列表 padding-left | calc(1em + lg) = 32dp，圆点 left: 2px 微调不贴边 |
| 有序列表 padding-left | calc(1em + lg) = 32dp，数字 left: 0 |
| 任务列表 padding-left | calc(18dp + lg) = 34dp，checkbox left: 0 |
| 标记到文字间距 | lg (16dp)，三种列表统一 |
| 圆点垂直居中 | `calc((--li-line-height - bullet-size) / 2)` |
| checkbox 垂直居中 | `calc((--li-line-height - --li-checkbox-size) / 2)` |
| 嵌套列表 | padding-left: 0，标记与上一级文字左边缘对齐；最大5级，第6级起停止缩进 |

#### Table（表格）🆕

| 属性 | 值 |
|------|-----|
| 表头字重 | Demibold-450 |
| 表头背景 | 无（transparent） |
| padding | md (12dp) |
| 边框 | 1dp solid block.table.border |
| 正文字号 | text.primary 同款 16dp |
| 对齐 | 支持 Markdown 对齐语法（`:---` 左 / `:---:` 中 / `---:` 右） |
| 空单元格 | 显示为空白，保持单元格高度 |
| 窄屏处理 | 横向可滚动，不缩放 |

#### Image（图片）🆕

| 属性 | 值 |
|------|-----|
| 最大宽度 | 100%（不超出阅读区域） |
| 圆角 | 8dp |
| 上下间距 | md (12dp) |
| 图注 (caption) | text.secondary 13dp，居左对齐 |
| 加载失败 | 显示 alt 文字 + 占位图标 |

#### Link（链接）🆕

链接与用户主动下划线都带下划线，但本质不同：

| 场景 | 语法 | 颜色 | 下划线 | 说明 |
|------|------|------|--------|------|
| 链接 | `[text](url)` | 笔记主题色 #FFBB0F | ✅ 必须有，1dp 与链接文字同色 | 主题色 + 下划线双重标识，可跳转 |
| 用户主动下划线 | `<u>text</u>` | text.primary（正文色值） | ✅ 有，1dp 与正文同色 | 纯装饰性，无交互行为，颜色与正文一致 |

| 属性 | 值 |
|------|-----|
| 颜色 | 笔记主题色 #FFBB0F（Light/Dark 通用） |
| 下划线 | 1dp，与链接文字同色，**链接必须带下划线** |
| 点击态 | opacity 0.7 |
| 字号/行高 | 继承所在段落 |

#### Task List（任务列表）🆕

| 属性 | 值 |
|------|-----|
| Checkbox 尺寸 | 默认 18 × 18dp；data-heading 模式下随级别缩放（H3: 20dp, H2: 22dp, H1: 24dp） |
| Checkbox 描边 | 2dp 内描边，rgba(0, 0, 0, 0.2) / Dark: rgba(255, 255, 255, 0.2) |
| Checkbox 圆角 | 默认 4dp；H1/H2 为 5dp |
| 选中态填充 | rgba(0, 0, 0, 0.2) / Dark: rgba(255, 255, 255, 0.2)，描边透明（不叠加） |
| 选中态图标 | 白色勾选，图标尺寸默认 12dp，随级别缩放（H3: 14dp, H2: 15dp, H1: 16dp） |
| 未选中边框 | rgba(0, 0, 0, 0.2) / Dark: rgba(255, 255, 255, 0.2) |
| 与文字对齐 | Checkbox 绝对定位 left: 0，通过 `calc((--li-line-height - --li-checkbox-size) / 2)` 垂直居中于首行 |
| 已完成文字颜色 | #000000 (Alpha 30%) / Dark: #FFFFFF (Alpha 30%) |
| 选中文字样式 | 无删除线（保持可读性） |

#### Heading Bold Toggle（标题加粗切换）

**机制：** 块编辑器通过 `data-bold="false"` 属性标记取消加粗的标题。

| 属性 | 值 |
|------|-----|
| 适用范围 | 仅 H1-H3（H4-H6 不支持，字号与正文相同，降权后区分度不足） |
| 默认状态 | 无 `data-bold` 属性 = Demibold-450（加粗开启） |
| 取消加粗 | `data-bold="false"` = Medium-380 |
| 与 `<strong>` 的关系 | 取消加粗后，标题内 `**bold**` 文字恢复 450，可见加粗效果 |

#### Heading List（列表标题样式）

**机制：** 块编辑器通过 `<div data-heading="hN">` 包裹列表（`<ul>` / `<ol>`），内部 `<li>` 通过 CSS relay 变量继承对应标题级别的排版参数。无 `data-heading` 属性时，relay 变量取默认值（= body 级别），普通列表行为不变。

**Relay 变量定义：**

| 变量名 | 作用 | 默认值（body） |
|--------|------|----------------|
| `--li-font-size` | 列表项字号 | `var(--font-size-body)` = 16dp |
| `--li-font-weight` | 列表项字重 | `var(--font-weight-body)` = 330 |
| `--li-line-height` | 列表项行高 | `var(--line-height-body)` = 25.6dp |
| `--li-checkbox-size` | Checkbox 边长 | 18px |
| `--li-checkbox-radius` | Checkbox 圆角 | 4px |
| `--li-checkmark-size` | 勾选图标尺寸 | 12px |

**各级别参数对照表：**

| 参数 | H1 | H2 | H3 | H4-H6 | body（默认） |
|------|-----|-----|-----|--------|-------------|
| font-size | 22dp | 20dp | 18dp | 16dp | 16dp |
| font-weight | 450 | 450 | 450 | 450 | 330 |
| line-height | 29.7dp | 28dp | 26.1dp | 24dp | 25.6dp |
| checkbox-size | 24dp | 22dp | 20dp | 18dp | 18dp |
| checkbox-radius | 5dp | 5dp | 4dp | 4dp | 4dp |
| checkmark-size | 16dp | 15dp | 14dp | 12dp | 12dp |

**叠加规则：**
- `data-heading` 与 `data-indent` 可叠加使用，互不干扰
- 颜色：列表项文字使用 `--color-heading`（标题色），非 `--color-text-primary`；行内代码块（`` `code` ``）不继承标题色，保持 `--color-text-code` 正文代码色值

---

## 七、Markdown 映射规范（AI 关键）

### 1. 标准映射

```
系统注入 → heading.page (PageTitle)

# → heading.section (H1)
## → heading.subsection (H2)
### → heading.caption (H3)
#### / ##### / ###### → heading.minor (H4-H6)

正文 → text.primary
`code` → text.code
**bold** → text.emphasis
*italic* → text.italic
~~strike~~ → text.strike
==mark== → text.highlight（自定义扩展）
[text](url) → text.link

- / * → block.list.unordered
1. → block.list.ordered
- [ ] / - [x] → block.task
<div data-heading="hN"> + 列表 → block.list.heading（列表项继承 hN 的字号/字重/行高）
<hN data-bold="false"> → heading 取消加粗（Demibold-450 降为 Medium-380，仅 H1-H3）
> → block.quote
--- → block.divider
| table | → block.table
![alt](url) → media.image
```

### 2. 强调规则

- `**text**` → text.emphasis（加粗，推荐使用）
- `*text*` → text.italic（斜体，不推荐中文使用）
- `==text==` → text.highlight（高亮，自定义扩展）

### 3. 异常内容处理

| 场景 | Fallback 规则 |
|------|-------------|
| 无法解析的 Markdown 语法 | 以纯文本显示，不丢失内容 |
| 非标准扩展语法（如 `==text==`） | 不识别时显示原始文本 |
| 内联 HTML（导入内容常见） | 仅允许格式类标签渲染，禁止脚本和交互类标签。具体白名单由研发安全团队定义 |
| 超深层嵌套（>5 层列表/引用） | 列表：最大5级嵌套，标记与上一级文字对齐（padding-left: 0），第6级起停止缩进；引用：视觉打平，只有「引用/不引用」两种状态 |
| H4-H6 标题（`####` 及以上） | 统一渲染为 heading.minor 样式（16dp/Demibold-450） |
| 极长单行文本（无换行符） | 强制 `word-break: break-all`，不允许撑破容器 |
| 中英文混排间距 | 中文与英文/数字之间自动插入 0.25em 间距（CSS `text-autospace` 或 JS polyfill） |
| 空内容（零字符文档） | 显示编辑器默认占位提示，不显示空白页 |

---

## 八、CSS Token 速查表

完整的 CSS Custom Properties 变量清单，研发直接对照实现。

```css
/* ===== Typography ===== */
--font-size-page-title: 26dp;
--font-size-h1: 22dp;
--font-size-h2: 20dp;
--font-size-h3: 18dp;
--font-size-h4: 16dp;   /* H4-H6 统一 */
--font-size-body: 16dp;
--font-size-secondary: 13dp;
--font-size-code: 15dp;

--font-weight-page-title: 520;  /* Semibold */
--font-weight-h1: 450;          /* Demibold */
--font-weight-h2: 450;
--font-weight-h3: 450;
--font-weight-h4: 450;
--font-weight-body: 380;        /* Medium */
--font-weight-medium: 380;      /* Medium — 标题取消加粗态 */
--font-weight-secondary: 330;   /* Regular */

--line-height-page-title: 33.8dp;
--line-height-h1: 29.7dp;
--line-height-h2: 28dp;
--line-height-h3: 26.1dp;
--line-height-h4: 24dp;
--line-height-body: 25.6dp;
--line-height-secondary: 15.6dp;
--line-height-code: 16.8dp;

/* ===== Spacing ===== */
--spacing-xs: 4dp;
--spacing-sm: 8dp;
--spacing-md: 12dp;
--spacing-lg: 16dp;
--spacing-xl: 24dp;
--spacing-xxl: 32dp;

/* ===== List Relay Variables (列表项中继变量) ===== */
/* 定义在 .markdown-body li 上，默认值 = body 级别 */
/* [data-heading="hN"] li 覆写为对应标题级别 */
--li-font-size: var(--font-size-body);        /* 默认 16dp */
--li-font-weight: var(--font-weight-body);    /* 默认 330 */
--li-line-height: var(--line-height-body);    /* 默认 25.6dp */
--li-checkbox-size: 18px;                      /* 默认 18dp */
--li-checkbox-radius: 4px;                     /* 默认 4dp */
--li-checkmark-size: 12px;                     /* 默认 12dp */

/* ===== Colors (Light) ===== */
--color-heading: #000000;
--color-text-primary: rgba(0, 0, 0, 0.9);
--color-text-secondary: rgba(0, 0, 0, 0.4);
--color-text-code: rgba(0, 0, 0, 0.6);
--color-text-link: #FFBB0F;
--color-text-link-active: rgba(255, 187, 15, 0.7);
--color-bg-code: rgba(0, 0, 0, 0.04);
--color-border-divider: rgba(0, 0, 0, 0.1);
--color-text-quote: rgba(0, 0, 0, 0.6);
--color-border-quote: rgba(0, 0, 0, 0.4);
--color-border-table: #E5E5E5;
--color-bg-table-header: rgba(0, 0, 0, 0.04);
--color-task-unchecked: rgba(0, 0, 0, 0.2);

/* ===== Colors (Dark) ===== */
--color-heading-dark: #FFFFFF;
--color-text-primary-dark: rgba(255, 255, 255, 0.95);
--color-text-secondary-dark: rgba(255, 255, 255, 0.4);
--color-text-code-dark: rgba(255, 255, 255, 0.6);
--color-text-link-dark: #FFC73A;
--color-text-link-active-dark: rgba(255, 199, 58, 0.7);
--color-bg-code-dark: rgba(255, 255, 255, 0.04);
--color-border-divider-dark: rgba(255, 255, 255, 0.1);
--color-text-quote-dark: rgba(255, 255, 255, 0.6);
--color-border-quote-dark: rgba(255, 255, 255, 0.4);
--color-border-table-dark: #262626;
--color-bg-table-header-dark: rgba(255, 255, 255, 0.04);
--color-task-unchecked-dark: rgba(255, 255, 255, 0.2);

/* ===== Transition ===== */
--transition-theme: color 0.3s ease, background-color 0.3s ease;
```

---

## 九、验收标准

研发实现后，按以下 checklist 逐项验收：

### 元素覆盖率

- [ ] PageTitle（系统注入）
- [ ] PageMeta（系统注入，text.secondary，格式：YYYY年M月D日 HH:MM，与 PageTitle 间距 sm 8dp）
- [ ] H1 / H2 / H3 / H4-H6
- [ ] 正文段落
- [ ] 加粗 / 斜体 / 删除线 / 高亮
- [ ] 行内代码 / 代码块（含语法高亮）
- [ ] 链接（主题色 #FFBB0F、必须带下划线、点击态）
- [ ] 图片（max-width、圆角、图注、加载失败态）
- [ ] 表格（表头、边框、对齐、窄屏横向滚动）
- [ ] 引用块（左边框 2dp、无背景、不嵌套）
- [ ] 有序列表 / 无序列表（缩进、多层级）
- [ ] 任务列表（checkbox 尺寸、选中态、与正文左对齐不缩进、已完成文字 Alpha 30%）
- [ ] 列表标题样式（data-heading H1-H3 字号/字重明显区别于正文列表；bullet/number/checkbox 垂直居中；checkbox 等比缩放；与 data-indent 可叠加；无 data-heading 的普通列表不受影响）
- [ ] 标题加粗切换（H1-H3 data-bold="false" 字重降为 380；无属性时保持 450；取消加粗后内部 **bold** 可见加粗效果；H4-H6 不受影响）
- [ ] 分割线

### 一致性验证

- [ ] 用户手写内容、AI 生成内容、导入内容在同一页面中渲染风格一致
- [ ] 同一元素的 font-size、line-height、margin 值在三种来源中完全相同
- [ ] 混合内容测试：同一页面中标题、表格、代码块、图片、引用、列表紧邻排列，元素交界处间距正确且一致

### 暗黑模式

- [ ] Light → Dark 切换后所有元素颜色正确
- [ ] 切换过渡动画平滑（0.3s ease）
- [ ] 代码块背景、表格边框、引用边框在 Dark 模式下可见

### 响应式

- [ ] 标准屏（≥600dp）：阅读区域 max-width 720dp
- [ ] 紧凑屏（<600dp）：间距缩减一级，字号不变
- [ ] 表格窄屏下可横向滚动
- [ ] 图片不超出阅读区域

---

## 十、Open Questions（待确认）

| # | 问题 | 影响范围 | 建议 |
|---|------|----------|------|
| ~~1~~ | ~~代码块语法高亮用什么配色方案？~~ | ~~代码块渲染~~ | 已确认：不支持彩色语法高亮，统一 text.code 单色（v2.9） |
| 2 | 图片是否需要支持点击放大？ | 图片交互 | MVP 不做，后续迭代 |
| 3 | 链接颜色是否跟随 HyperOS 主题色？ | 链接样式 | 当前用固定色值，后续可改为主题色变量 |
| 4 | 数学公式和脚注是否在 MVP 范围内？ | 元素覆盖 | 建议 MVP 不含，后续迭代补充 |

---

## 版本记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 (420) | 2026-04-20 | 初版：语义层、字体、间距、颜色、组件映射、Markdown 映射 |
| v2.0 | 2026-04-20 | 校对修复 8 项缺陷 + 补充表格/图片/链接/任务列表/响应式/异常处理 + 新增 CSS Token 速查表 + 新增验收标准 |
| v2.2 | 2026-04-20 | Demo 调试修订：引用块改为 2dp 边框无背景不嵌套、任务列表左对齐不缩进 + 已完成文字 Alpha 30% |
| v2.3 | 2026-04-20 | 区分下划线与链接：下划线为用户样式装饰继承段落色，链接为可跳转内容使用笔记主题色 #FFBB0F |
| v2.4 | 2026-04-20 | 表头背景改为 transparent（仅靠边框区分）；补充图片加载失败态验证（alt 文字 + 占位图标） |
| v2.5 | 2026-04-20 | 列表对齐优化：有序列表改用 CSS counter + `::before` 方案，序号与文字间距 md (12dp)；无序列表 `padding-left: 2px` 微调不贴边 |
| v2.6 | 2026-04-21 | 引用块左边距 2px 微调不贴边；Checkbox 改为 18×18dp、2dp 内描边、选中/未选中统一 rgba(0,0,0,0.2)（Dark: rgba(255,255,255,0.2)）、选中态描边透明不叠加 |
| v2.7 | 2026-04-21 | 列表悬挂缩进（标记绝对定位 + padding-left，换行文字对齐首行）；三种列表标记到文字间距统一 lg (16dp)；嵌套列表 CSS 扁平化；圆点/checkbox 垂直居中于首行；引用竖线高度仅覆盖文字区域（不含行高），色值改用 --color-border-quote Alpha 40%；行内代码字号 14dp → 15dp；代码块 padding 改为 lg (16dp)，横向滚动左右边距不塌陷；引用块 padding-left 改为 lg (16dp) |
| v2.8 | 2026-04-21 | 标题字号体系调整：H2 18→20dp、H3 16→18dp，形成 22→20→18→16 均匀递减阶梯；H4-H6 独立为 heading.minor token（16dp/450），不再降级复用 H3；标准映射/颜色映射/验收标准同步补充 H4-H6；Demo 混合示例新增 H4-H6 演示段落 |
| v2.9 | 2026-04-22 | 列表标题样式：新增 data-heading 块编辑器能力，列表项可继承 H1-H6 标题排版；引入 6 个 li relay 变量（--li-font-size/font-weight/line-height/checkbox-size/checkbox-radius/checkmark-size）；checkbox 随标题级别等比缩放（18-24dp）；更新列表/任务列表组件定义、缩进公式、CSS Token 速查表、验收标准；标题加粗切换：H1-H3 支持 data-bold="false" 取消加粗（Demibold-450 → Medium-380），新增 --font-weight-medium token |
| v3.0 | 2026-04-24 | 列表嵌套缩进重构：从扁平化改为阶梯缩进，嵌套列表 padding-left: 0，标记与上一级文字左边缘对齐；最大5级，第6级起停止缩进；表格边框色值改为固定色值（Light #E5E5E5 / Dark #262626），不使用透明度 |
