# 《重启人生》API服务

基于Go和Gin框架的RESTful API服务，为《重启人生》游戏提供后端支持。

## 🚀 快速开始

### 环境要求
- Go 1.21+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd restart-life-api
```

2. **安装依赖**
```bash
go mod tidy
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件配置数据库等信息
```

4. **启动服务**
```bash
# 使用Docker Compose启动数据库
docker-compose up -d postgres redis

# 运行数据库迁移
go run cmd/migrate/main.go

# 启动API服务
go run cmd/server/main.go
```

### Docker部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f api
```

## 📂 项目结构

```
restart-life-api/
├── cmd/
│   └── server/          # 应用程序入口点
├── internal/
│   ├── api/
│   │   ├── handlers/    # HTTP处理器
│   │   ├── middleware/  # 中间件
│   │   └── routes/      # 路由定义
│   ├── models/          # 数据模型
│   ├── services/        # 业务逻辑服务
│   ├── repository/      # 数据访问层
│   │   ├── postgres/    # PostgreSQL仓储
│   │   └── redis/       # Redis缓存
│   └── config/          # 配置管理
├── pkg/
│   ├── utils/           # 工具函数
│   └── database/        # 数据库连接
├── migrations/          # 数据库迁移文件
├── docker/              # Docker配置
└── docs/                # API文档
```

## 🔧 技术栈

- **语言**: Go 1.21+
- **框架**: Gin Web框架
- **数据库**: PostgreSQL 15+
- **缓存**: Redis 7+
- **认证**: JWT
- **日志**: Logrus
- **监控**: Prometheus
- **容器**: Docker

## 📋 API接口

### 认证接口
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新令牌

### 角色管理
- `POST /api/v1/characters` - 创建角色
- `GET /api/v1/characters` - 获取角色列表
- `GET /api/v1/characters/{id}` - 获取角色详情
- `DELETE /api/v1/characters/{id}` - 删除角色

### 游戏进程
- `POST /api/v1/characters/{id}/advance` - 推进人生
- `POST /api/v1/characters/{character_id}/events/{event_id}/choose` - 做出选择
- `GET /api/v1/characters/{id}/events` - 获取事件历史

## 🛠️ 开发指南

### 添加新的API接口

1. **定义模型**（`internal/models/`）
2. **创建仓储**（`internal/repository/`）
3. **实现服务**（`internal/services/`）
4. **添加处理器**（`internal/api/handlers/`）
5. **注册路由**（`internal/api/routes/`）

### 数据库迁移

```bash
# 创建新迁移
migrate create -ext sql -dir migrations -seq migration_name

# 执行迁移
migrate -path migrations -database "postgres://user:password@localhost/dbname?sslmode=disable" up

# 回滚迁移
migrate -path migrations -database "postgres://user:password@localhost/dbname?sslmode=disable" down 1
```

### 运行测试

```bash
# 运行所有测试
go test ./...

# 运行特定包的测试
go test ./internal/services/...

# 运行测试并查看覆盖率
go test -cover ./...
```

## 📊 监控和日志

- **健康检查**: `GET /health`
- **指标收集**: `GET /metrics` (Prometheus格式)
- **日志级别**: 可通过环境变量 `LOG_LEVEL` 配置

## 🔐 安全

- JWT认证
- 密码加密（bcrypt）
- CORS配置
- 速率限制
- SQL注入防护

## 📈 性能优化

- Redis缓存
- 数据库连接池
- 查询优化
- 索引策略
- 分页查询

---

更多详细信息请参考 [技术设计文档](../prdtd/后端技术设计文档_Backend_TD.md) 