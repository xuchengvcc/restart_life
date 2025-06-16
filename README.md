# 《重启人生》游戏项目

一款人生模拟游戏，玩家可以体验不同时代、不同国家、不同背景下的完整人生历程。

## 📂 项目结构

```
restart_life/
├── restart-life-unity/          # Unity客户端项目
│   ├── Assets/                  # Unity资源文件
│   ├── ProjectSettings/         # 项目设置
│   └── Packages/               # Unity包管理
├── restart-life-api/           # Go后端API服务
│   ├── cmd/                    # 应用程序入口点
│   ├── internal/               # 内部业务逻辑
│   ├── pkg/                    # 公共库
│   ├── migrations/             # 数据库迁移
│   └── docker/                 # Docker配置
├── docs/                       # 项目文档
│   ├── api/                    # API文档
│   └── deployment/             # 部署文档
├── prdtd/                      # 产品需求和技术设计文档
│   ├── PRD.md                  # 产品需求文档
│   ├── 前端技术设计文档_Frontend_TD.md
│   └── 后端技术设计文档_Backend_TD.md
└── regulations/                # 游戏规则和设计
    └── regulation.md
```

## 🚀 技术栈

### 前端 (Unity客户端)
- **游戏引擎**: Unity 2022.3 LTS
- **编程语言**: C#
- **UI框架**: Unity UI Toolkit
- **网络通信**: HTTP客户端 + JSON

### 后端 (Go API服务)
- **编程语言**: Go 1.21+
- **Web框架**: Gin
- **数据库**: PostgreSQL 15+
- **缓存**: Redis 7+
- **容器**: Docker + Docker Compose

## 🏗️ 开发指南

### 前端开发
1. 进入Unity项目目录：`cd restart-life-unity`
2. 使用Unity Hub打开项目
3. 参考：[前端技术设计文档](prdtd/前端技术设计文档_Frontend_TD.md)

### 后端开发
1. 进入API项目目录：`cd restart-life-api`
2. 安装Go依赖：`go mod tidy`
3. 启动开发环境：`docker-compose up -d`
4. 参考：[后端技术设计文档](prdtd/后端技术设计文档_Backend_TD.md)

## 📖 文档

- [产品需求文档 (PRD)](prdtd/PRD.md)
- [游戏规则设计](regulations/regulation.md)
- [前端技术设计](prdtd/前端技术设计文档_Frontend_TD.md)
- [后端技术设计](prdtd/后端技术设计文档_Backend_TD.md)

## 🔄 开发流程

1. **需求分析**: 参考PRD和游戏规则文档
2. **技术设计**: 遵循前后端技术设计文档
3. **并行开发**: 前后端团队可独立开发
4. **接口对接**: 按照API设计文档进行集成
5. **测试部署**: 使用Docker容器化部署

## 🤝 团队协作

- **前端团队**: 负责Unity客户端开发
- **后端团队**: 负责Go API服务开发
- **产品团队**: 负责需求定义和内容设计
- **运维团队**: 负责部署和监控

---

*项目采用前后端分离架构，确保开发效率和代码质量。*