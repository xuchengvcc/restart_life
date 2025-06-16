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
