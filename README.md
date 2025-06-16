# 《重启人生》游戏项目

## 📋 项目概述

《重启人生》是一款文字模拟人生游戏，玩家可以随机重新开启自己的人生，体验不同时代、不同国家的人生轨迹。

## 🏗️ 项目架构

本项目采用多仓库架构，支持Unity客户端、Web前端和Go后端的独立开发：

- **Unity客户端**: Unity 2022.3 LTS 桌面/移动端游戏
- **Web前端**: React + TypeScript + Vite 浏览器游戏界面
- **后端API**: Go + Gin + PostgreSQL 服务端

## 📁 仓库结构

```
《重启人生》项目生态
├── restart-life                    # 📄 主文档仓库（当前）
│   ├── 产品需求文档
│   ├── 技术设计文档
│   ├── 项目管理文档
│   └── 仓库管理工具
├── restart-life-api                # 🚀 后端API服务
│   ├── Go + Gin + PostgreSQL
│   ├── RESTful API接口
│   ├── 数据库设计和迁移
│   └── Docker部署配置
├── restart-life-unity              # 🎮 Unity游戏客户端
│   ├── Unity 2022.3 LTS项目
│   ├── C#游戏逻辑代码
│   ├── UI界面和资源
│   └── 多平台构建配置
└── restart-life-web                # 🌐 Web前端界面
    ├── React + TypeScript + Vite
    ├── 现代化响应式UI设计
    ├── 浏览器游戏界面
    └── 渐进式Web应用(PWA)
```

## 🚀 快速开始

### 环境要求

- **Node.js**: 18+
- **Unity**: 2022.3 LTS
- **Go**: 1.21+
- **PostgreSQL**: 15+
- **Redis**: 7+

### 工作区设置

1. **克隆主文档仓库**
```bash
git clone https://github.com/your-username/restart-life.git
cd restart-life
```

2. **安装工作区管理工具**
```bash
npm install
```

3. **克隆所有子项目仓库**
```bash
# 在 go_learning 目录下克隆各个仓库
cd ..
git clone https://github.com/your-username/restart-life-api.git restart_life_backend
git clone https://github.com/your-username/restart-life-unity.git restart_life_frontend  
git clone https://github.com/your-username/restart-life-web.git restart_life_web
```

4. **安装所有依赖**
```bash
cd restart-life
npm run install:all
```

### 开发服务启动

**启动Web前端 + 后端API**
```bash
npm run dev:all
```

**单独启动服务**
```bash
# Web前端开发服务器
npm run dev:web

# 后端API服务
npm run dev:backend

# Unity项目（使用Unity编辑器）
echo "请使用Unity Hub打开 restart_life_frontend 项目"
```

### 项目构建

```bash
# 构建所有项目
npm run build:all

# 单独构建
npm run build:web      # Web前端
npm run build:backend  # 后端API
```

## 🔧 工作区管理

### 多仓库状态检查
```bash
npm run status:all
```

### 同步所有仓库
```bash
npm run pull:all
```

### 代码格式化
```bash
npm run format:all
```

### 运行测试
```bash
npm run test:all
```

## 📚 文档

### 核心文档
- [产品需求文档 (PRD)](./prdtd/PRD.md)
- [技术设计文档](./prdtd/Technical_Design_Document.md)
- [游戏规则文档](./regulations/regulation.md)

### 技术文档
- [Unity客户端技术设计](./prdtd/前端技术设计文档_Frontend_TD.md)
- [Web前端技术设计](./prdtd/Web前端技术设计文档_Frontend_Web_TD.md)
- [后端技术设计](./prdtd/后端技术设计文档_Backend_TD.md)

### 管理文档
- [仓库管理指南](./仓库管理指南.md)
- [Web前端独立化指南](./Web前端独立化指南.md)
- [工作区配置](./workspace.yaml)

## 🎯 各仓库链接

| 仓库 | 描述 | 技术栈 | 状态 |
|------|------|--------|------|
| [restart-life](https://github.com/your-username/restart-life) | 主文档仓库 | Markdown | ✅ 活跃 |
| [restart-life-api](https://github.com/your-username/restart-life-api) | 后端API服务 | Go + PostgreSQL | ✅ 活跃 |
| [restart-life-unity](https://github.com/your-username/restart-life-unity) | Unity客户端 | Unity + C# | ✅ 活跃 |
| [restart-life-web](https://github.com/your-username/restart-life-web) | Web前端 | React + TypeScript | ✅ 活跃 |

## 👥 团队协作

### 团队结构
- **产品团队**: 需求分析、游戏内容设计、项目协调
- **Unity团队**: Unity客户端开发、游戏界面设计
- **Web团队**: Web前端开发、浏览器游戏界面
- **后端团队**: API服务开发、数据库设计、部署运维

### 工作流程
1. 在主文档仓库讨论需求和设计
2. 各团队在对应仓库进行开发
3. 通过API接口进行前后端集成
4. 定期同步和版本发布

## 🎮 游戏特色

- **🌍 全球历史体验**: 支持全球任意国家，时间跨度1800-2050年
- **🎲 随机人生**: 每次游戏都有独特的人生轨迹和体验
- **📈 深度模拟**: 复杂的属性系统、关系网络、成就系统
- **🌟 多元发展**: 支持多种人生路径和成功定义
- **📱 多平台支持**: Unity客户端、Web应用、移动端

## 🤝 贡献指南

1. Fork 对应的仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 遵循约定式提交规范
4. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
5. 推送到分支 (`git push origin feature/AmazingFeature`)
6. 创建 Pull Request

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

## 📞 联系我们

- 项目负责人: [项目经理邮箱]
- 技术负责人: [技术负责人邮箱]
- 问题反馈: [GitHub Issues](https://github.com/your-username/restart-life/issues)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

*采用多仓库分离架构，确保开发效率与代码质量并重。*
