# 《重启人生》游戏项目 - 主文档仓库

一款人生模拟游戏，玩家可以体验不同时代、不同国家、不同背景下的完整人生历程。

## 🏗️ 项目架构

本项目采用**多仓库分离架构**，各组件独立开发和部署：

```
《重启人生》项目生态
├── restart_life                    # 📄 主文档仓库（当前仓库）
│   ├── 产品需求文档 (PRD)
│   ├── 技术设计文档 (TD)
│   ├── 游戏规则设计
│   ├── 项目管理配置
│   └── 团队协作指南
├── restart-life-api                # 🚀 后端API服务（独立仓库）
│   ├── Go + Gin + PostgreSQL
│   ├── RESTful API接口
│   ├── 数据库设计和迁移
│   └── Docker部署配置
└── restart-life-unity              # 🎮 Unity客户端（独立仓库）
    ├── Unity 2022.3 LTS项目
    ├── C#游戏逻辑代码
    ├── UI界面和资源
    └── 多平台构建配置
```

## 🔗 相关仓库链接

- **🚀 后端API服务**: [restart-life-api](https://github.com/your-org/restart-life-api)
- **🎮 Unity客户端**: [restart-life-unity](https://github.com/your-org/restart-life-unity)

## 📖 项目文档

- **[产品需求文档 (PRD)](prdtd/PRD.md)** - 完整的产品需求和功能规格
- **[游戏规则设计](regulations/regulation.md)** - 核心游戏机制和规则
- **[后端技术设计](prdtd/后端技术设计文档_Backend_TD.md)** - Go API服务技术架构
- **[仓库管理指南](仓库管理指南.md)** - 多仓库协作和管理指南

## 🚀 快速开始

### 对于前端开发者
```bash
# 克隆Unity项目仓库
git clone https://github.com/your-org/restart-life-unity.git
cd restart-life-unity

# 使用Unity 2022.3 LTS打开项目
# 配置后端API地址
# 开始开发Unity客户端
```

### 对于后端开发者
```bash
# 克隆API服务仓库
git clone https://github.com/your-org/restart-life-api.git
cd restart-life-api

# 安装依赖
go mod tidy

# 启动开发环境
docker-compose up -d
```

### 对于产品和运维
- 本仓库维护所有项目文档和协调配置
- 查看 [仓库管理指南](仓库管理指南.md) 了解详细的协作流程
- 协调前后端开发进度和版本发布

## 🎮 游戏特色

- **🌍 全球历史体验**: 支持全球任意国家，时间跨度1800-2050年
- **🎲 随机人生**: 每次游戏都有独特的人生轨迹和体验
- **📈 深度模拟**: 复杂的属性系统、关系网络、成就系统
- **🌟 多元发展**: 支持多种人生路径和成功定义
- **📱 多平台支持**: Unity客户端、Web应用、微信小程序

## 🤝 团队协作

- **📝 产品团队**: 负责需求定义、内容设计、项目协调
- **🚀 后端团队**: 负责Go API服务开发和数据库设计
- **🎮 前端团队**: 负责Unity客户端开发和用户体验
- **🔧 运维团队**: 负责部署配置、监控、性能优化

## 📊 开发状态

| 组件 | 状态 | 技术栈 | 负责团队 |
|------|------|--------|----------|
| 主文档 | ✅ 完成 | Markdown | 产品团队 |
| 后端API | 🚧 开发中 | Go + PostgreSQL | 后端团队 |
| Unity客户端 | 🚧 开发中 | Unity + C# | 前端团队 |

## 📄 许可证

MIT License

---

*采用多仓库分离架构，确保开发效率与代码质量并重。*

# 《重启人生》Web前端

基于 React 18 + TypeScript + Vite 构建的现代化Web游戏前端，为《重启人生》人生模拟游戏提供流畅的Web体验。

## 🎮 项目概述

《重启人生》Web前端是一个响应式的单页应用程序，提供：
- 🌟 现代化的用户界面设计
- 📱 完全响应式，支持桌面和移动设备
- ⚡ 基于Vite的快速开发体验
- 🔧 TypeScript类型安全
- 🎨 Tailwind CSS样式系统

## 🚀 技术栈

### 核心框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 下一代前端构建工具
- **React Router** - 客户端路由

### 样式和UI
- **Tailwind CSS** - 原子化CSS框架
- **Lucide React** - 现代图标库
- **PostCSS** - CSS后处理器

### 状态管理和数据
- **Zustand** - 轻量级状态管理
- **Axios** - HTTP客户端

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 静态类型检查

## 🏗️ 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ui/             # 基础UI组件
│   ├── game/           # 游戏相关组件
│   └── common/         # 通用组件
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── Game.tsx        # 游戏页面
│   └── About.tsx       # 关于页面
├── hooks/              # 自定义React Hooks
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
├── api/                # API接口层
├── store/              # 状态管理
├── assets/             # 静态资源
├── App.tsx             # 根组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🛠️ 开发指南

### 环境要求
- Node.js 18+
- npm 9+ 或 yarn 1.22+ 或 pnpm 8+

### 快速开始

1. **克隆项目**
```bash
git clone https://github.com/your-org/restart-life-web.git
cd restart-life-web
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. **在浏览器中打开** [http://localhost:3000](http://localhost:3000)

### 可用脚本

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码质量检查
npm run lint

# 自动修复ESLint问题
npm run lint:fix

# 代码格式化
npm run format

# TypeScript类型检查
npm run type-check
```

### 环境变量

创建 `.env.local` 文件配置环境变量：

```env
# API服务地址
VITE_API_BASE_URL=http://localhost:8080

# 是否启用调试模式
VITE_DEBUG=true

# 应用标题
VITE_APP_TITLE=《重启人生》Web版
```

## 📦 构建和部署

### 构建生产版本
```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 部署选项

#### 静态网站托管
- **Vercel**: 推荐，与GitHub集成
- **Netlify**: 简单易用
- **GitHub Pages**: 免费选项

#### Docker部署
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🎨 设计系统

### 颜色主题
- **主色调**: 紫色渐变 (`from-purple-600 to-pink-600`)
- **背景**: 深色渐变 (`from-slate-900 via-purple-900 to-slate-900`)
- **文本**: 白色和灰色层次

### 组件规范
- 使用 Tailwind CSS 类名
- 遵循 React 函数组件模式
- TypeScript 接口定义 props

## 🔗 相关仓库

- **后端API服务**: [restart-life-api](https://github.com/your-org/restart-life-api)
- **Unity客户端**: [restart-life-unity](https://github.com/your-org/restart-life-unity)
- **主文档仓库**: [restart_life](https://github.com/your-org/restart_life)

## 📄 API集成

Web前端通过RESTful API与后端服务通信：

```typescript
// API基础配置
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
})

// 用户认证
POST /api/auth/login
POST /api/auth/register

// 游戏数据
GET /api/characters
POST /api/characters
PUT /api/characters/:id/advance
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 组件和函数使用驼峰命名
- 文件名使用 PascalCase（组件）或 camelCase（工具）

## 📈 性能优化

- ⚡ Vite 构建优化
- 📦 代码分割和懒加载
- 🗜️ 静态资源压缩
- 🚀 现代浏览器优化

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

*采用现代化技术栈，为《重启人生》提供极致的Web游戏体验。*
