# 《重启人生》Web前端独立化指南

## 📋 概述

本指南将帮助您将Web前端项目从主仓库独立出来，创建专门的`restart-life-web`仓库。

## 🎯 目标架构

独立化后的项目结构：
```
《重启人生》项目生态
├── restart_life                    # 📄 主文档仓库（当前）
├── restart-life-api                # 🚀 后端API服务
├── restart-life-unity              # 🎮 Unity游戏客户端
└── restart-life-web                # 🌐 Web前端界面 ⭐ 新增
```

## 🚀 快速开始

### 方法一：使用自动化脚本（推荐）

1. **在GitHub上创建仓库**
   - 访问 [https://github.com/new](https://github.com/new)
   - 仓库名：`restart-life-web`
   - 描述：`《重启人生》游戏Web前端 - React + TypeScript + Vite现代化浏览器游戏界面`
   - 设置为公开仓库
   - **不要**勾选"Add a README file"
   - 点击"Create repository"

2. **运行自动化脚本**
   ```bash
   cd /Users/xucheng/go_learning/restart_life
   ./setup-web-frontend-repo.sh
   ```

3. **按提示输入GitHub用户名**，脚本会自动完成：
   - 配置远程仓库
   - 推送代码
   - 显示后续步骤

### 方法二：手动操作

如果您喜欢手动控制每个步骤：

1. **创建GitHub仓库**（同上）

2. **配置本地仓库**
   ```bash
   cd /Users/xucheng/go_learning/restart_life_web
   
   # 移除旧的远程配置（如果有）
   git remote remove origin
   
   # 添加新的远程仓库（替换your-username）
   git remote add origin https://github.com/your-username/restart-life-web.git
   
   # 设置主分支
   git branch -M main
   
   # 推送代码
   git push -u origin main
   ```

## 🔧 验证独立化结果

### 1. 检查远程仓库
```bash
cd /Users/xucheng/go_learning/restart_life_web
git remote -v
# 应该显示：
# origin  https://github.com/your-username/restart-life-web.git (fetch)
# origin  https://github.com/your-username/restart-life-web.git (push)
```

### 2. 验证项目可运行
```bash
cd /Users/xucheng/go_learning/restart_life_web
npm install
npm run dev
```
访问 http://localhost:5173 查看Web界面

### 3. 检查构建
```bash
npm run build
npm run preview
```

## 📦 Web前端项目特性

### 技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router
- **HTTP客户端**: Axios
- **图标**: Lucide React

### 项目结构
```
restart_life_web/
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   ├── hooks/              # 自定义Hooks
│   ├── store/              # 状态管理
│   ├── api/                # API调用
│   ├── types/              # TypeScript类型
│   ├── utils/              # 工具函数
│   └── assets/             # 静态资源
├── public/                 # 公共资源
├── package.json           # 依赖配置
├── vite.config.ts         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── README.md              # 项目文档
```

### 主要功能
- 🎮 游戏主界面
- 📱 响应式设计（支持桌面和移动端）
- 🌙 深色主题
- ⚡ 热重载开发
- 📦 生产构建优化
- 🔗 API集成准备

## 🔄 后续配置

### 1. GitHub仓库设置

**分支保护规则**：
- 访问仓库 → Settings → Branches
- 添加规则保护`main`分支：
  - Require pull request reviews before merging
  - Require status checks to pass before merging

**GitHub Pages部署**（可选）：
- Settings → Pages
- Source: GitHub Actions
- 使用提供的CI/CD配置自动部署

### 2. 团队协作

**邀请团队成员**：
- Settings → Manage access
- 添加Web前端开发团队成员

**设置团队权限**：
- Web前端Lead: Admin
- Web前端开发者: Write
- 其他团队: Read

### 3. CI/CD配置

在仓库中创建 `.github/workflows/web-ci.yml`：
```yaml
name: Web Frontend CI/CD
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
    - run: npm run type-check
    - run: npm run test
        
  build-and-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔗 与其他仓库的集成

### API集成
Web前端已经预配置了API集成层：
- `src/api/` 目录包含API调用封装
- 支持与Go后端的RESTful API通信
- 包含错误处理和请求拦截器

### 开发协调
1. **API变更通知**：后端API更新时，Web前端团队需要同步更新
2. **版本对齐**：重大功能发布时，确保前后端版本兼容
3. **测试协调**：集成测试需要前后端团队配合

## 📞 支持和帮助

### 常见问题

**Q: 推送时提示"Repository not found"**
A: 确保已在GitHub上创建了`restart-life-web`仓库，且仓库名拼写正确

**Q: npm install失败**
A: 检查Node.js版本（需要18+），清除缓存：`npm cache clean --force`

**Q: 开发服务器启动失败**
A: 检查端口5173是否被占用，或使用`npm run dev -- --port 3000`指定其他端口

### 获取帮助
- **技术问题**：在Web前端仓库创建Issue
- **项目协调**：在主文档仓库创建Issue
- **紧急支持**：联系Web前端团队Lead

---

*本指南会根据项目进展持续更新。如有问题或建议，请在主仓库提交Issue。* 