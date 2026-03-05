## 个人工作台（Personal Dashboard）

纯前端本地效率工具：待办 + 月历（日视图弹窗） + 常用工具入口，数据默认存储在浏览器 `localStorage`，并支持 **导出/导入 JSON 文件** 备份（覆盖式导入 + 严格校验）。

文档参考：
- `../PRDS/PRD.md`
- `../PRDS/UI.md`
- `../PRDS/development.md`
- `../ACCEPTANCE.md`（验收清单）

---

## 先决条件（必须）

本项目使用 Vite/React，需要安装 Node.js（建议 18+ 或 20+）。

### macOS 安装 Node（推荐其一）

1) 使用 Homebrew：

```bash
brew install node
```

2) 使用 nvm（更稳，推荐长期使用）：

```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install 20
nvm use 20
```

---

## 启动开发

在本目录执行：

```bash
npm install
npm run dev
```

---

## 构建与检查（质量闸门）

```bash
npm run typecheck
npm run lint
npm run build
```

---

## 本地打开方式（不跑 npm run dev）

**方式一：双击单个 HTML（推荐）**

1. 先执行一次：`npm run build:singlefile`
2. 在项目目录下会生成 **`个人工作台.html`**（约 1MB，JS/CSS 已内联）
3. 双击该文件即可在浏览器中打开，无需任何服务器

**方式二：一键启动本地服务器**

1. 双击 **`打开个人工作台.command`**（Mac）
2. 会自动启动静态服务并打开浏览器访问 `http://localhost:4173/个人工作台.html`
3. 需已安装 Node；首次会拉取 `serve` 包

**为何直接双击“带外链 JS 的”HTML 会空白？**  
浏览器不允许从 `file://` 协议加载 `type="module"` 的外链脚本，所以之前「个人工作台.html + assets/」用双击会白屏。单文件内联（方式一）或本地服务器（方式二）可避免该限制。

---

## 数据备份（重要）

顶部栏右侧点击“数据备份”：
- **导出**：下载 `personal-dashboard-backup-YYYYMMDD.json`
- **导入**：选择 `.json` 文件并确认（**会覆盖当前数据**；导入前建议先导出当前数据）

稳定性策略：
- 导入 JSON 会做结构与类型校验；校验失败不会改动现有数据。
- 备份文件包含 `version` 字段，为未来迁移预留。

