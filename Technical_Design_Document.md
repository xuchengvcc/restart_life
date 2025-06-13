# 《重启人生》技术设计文档 (TDD)

## 文档信息
- **版本**: v1.0
- **创建日期**: 2025-01-26
- **最后更新**: 2025-01-26
- **作者**: 技术团队

## 1. 技术架构概览

### 1.1 系统架构图
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Unity Client  │◄──►│   API Gateway    │◄──►│  Game Service   │
│                 │    │  (Load Balancer) │    │   (Go + Gin)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                               ┌─────────────────┐
                                               │   PostgreSQL    │
                                               │   Database      │
                                               └─────────────────┘
```

### 1.2 技术栈选择
- **客户端**: Unity 2022.3 LTS (C#)
- **后端服务**: Go 1.21+ + Gin框架
- **数据库**: PostgreSQL 15+
- **缓存**: Redis 7+
- **API网关**: Nginx
- **云服务**: AWS/阿里云

## 2. 数据库设计

### 2.1 数据库架构设计原则

基于[游戏数据库设计最佳实践](https://www.geeksforgeeks.org/how-to-design-a-database-for-multiplayer-online-games/)，我们采用以下设计原则：

1. **数据规范化**: 遵循第三范式，减少数据冗余
2. **性能优化**: 合理使用索引和分区
3. **扩展性**: 支持水平扩展和数据分片
4. **数据完整性**: 使用外键约束和触发器

### 2.2 核心数据表设计

#### 2.2.1 用户和角色表

```sql
-- 用户账户表
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 游戏角色表
CREATE TABLE characters (
    character_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    character_name VARCHAR(100) NOT NULL,
    birth_country VARCHAR(100) NOT NULL,
    birth_year INTEGER NOT NULL CHECK (birth_year BETWEEN 1800 AND 2050),
    current_age INTEGER NOT NULL DEFAULT 0,
    gender VARCHAR(20) NOT NULL,
    race VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色属性表
CREATE TABLE character_attributes (
    attribute_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    intelligence INTEGER NOT NULL DEFAULT 50 CHECK (intelligence BETWEEN 0 AND 100),
    constitution INTEGER NOT NULL DEFAULT 50 CHECK (constitution BETWEEN 0 AND 100),
    charisma INTEGER NOT NULL DEFAULT 50 CHECK (charisma BETWEEN 0 AND 100),
    willpower INTEGER NOT NULL DEFAULT 50 CHECK (willpower BETWEEN 0 AND 100),
    creativity INTEGER NOT NULL DEFAULT 50 CHECK (creativity BETWEEN 0 AND 100),
    academic_skill INTEGER NOT NULL DEFAULT 0 CHECK (academic_skill BETWEEN 0 AND 100),
    social_skill INTEGER NOT NULL DEFAULT 0 CHECK (social_skill BETWEEN 0 AND 100),
    athletic_skill INTEGER NOT NULL DEFAULT 0 CHECK (athletic_skill BETWEEN 0 AND 100),
    artistic_skill INTEGER NOT NULL DEFAULT 0 CHECK (artistic_skill BETWEEN 0 AND 100),
    business_skill INTEGER NOT NULL DEFAULT 0 CHECK (business_skill BETWEEN 0 AND 100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.2.2 事件系统表

```sql
-- 事件模板表
CREATE TABLE event_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'random', 'choice', 'development', 'relationship', 'era'
    description TEXT NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    required_attributes JSONB, -- 触发条件
    probability_weight DECIMAL(5,3) DEFAULT 1.0,
    era_start INTEGER, -- 时代限制
    era_end INTEGER,
    countries TEXT[], -- 国家限制
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 事件选择选项表
CREATE TABLE event_choices (
    choice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES event_templates(template_id) ON DELETE CASCADE,
    choice_text TEXT NOT NULL,
    choice_order INTEGER NOT NULL,
    requirements JSONB, -- 选择条件
    effects JSONB NOT NULL, -- 选择结果
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色事件历史表
CREATE TABLE character_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES event_templates(template_id),
    event_age INTEGER NOT NULL,
    chosen_option_id UUID REFERENCES event_choices(choice_id),
    event_result JSONB NOT NULL, -- 事件结果详情
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.2.3 关系系统表

```sql
-- 关系类型表
CREATE TABLE relationship_types (
    type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_name VARCHAR(50) UNIQUE NOT NULL, -- 'parent', 'sibling', 'spouse', 'child', 'friend', 'colleague'
    category VARCHAR(20) NOT NULL, -- 'family', 'social', 'professional'
    description TEXT
);

-- NPC角色表
CREATE TABLE npcs (
    npc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npc_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    birth_year INTEGER,
    occupation VARCHAR(100),
    personality_traits JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色关系表
CREATE TABLE character_relationships (
    relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    related_npc_id UUID NOT NULL REFERENCES npcs(npc_id),
    relationship_type_id UUID NOT NULL REFERENCES relationship_types(type_id),
    intimacy_level INTEGER NOT NULL DEFAULT 50 CHECK (intimacy_level BETWEEN 0 AND 100),
    trust_level INTEGER NOT NULL DEFAULT 50 CHECK (trust_level BETWEEN 0 AND 100),
    support_level INTEGER NOT NULL DEFAULT 50 CHECK (support_level BETWEEN 0 AND 100),
    start_age INTEGER NOT NULL,
    end_age INTEGER, -- 关系结束年龄
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.2.4 经济系统表

```sql
-- 角色经济状态表
CREATE TABLE character_economics (
    economics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    current_age INTEGER NOT NULL,
    cash_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    annual_income DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_assets DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_debts DECIMAL(15,2) NOT NULL DEFAULT 0,
    occupation VARCHAR(100),
    occupation_level INTEGER DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 经济事件记录表
CREATE TABLE economic_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'income', 'expense', 'investment', 'gift'
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    related_event_id UUID REFERENCES character_events(event_id),
    transaction_age INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.2.5 健康系统表

```sql
-- 角色健康状态表
CREATE TABLE character_health (
    health_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    current_age INTEGER NOT NULL,
    physical_health INTEGER NOT NULL DEFAULT 100 CHECK (physical_health BETWEEN 0 AND 100),
    mental_health INTEGER NOT NULL DEFAULT 100 CHECK (mental_health BETWEEN 0 AND 100),
    stress_level INTEGER NOT NULL DEFAULT 0 CHECK (stress_level BETWEEN 0 AND 100),
    fitness_level INTEGER NOT NULL DEFAULT 50 CHECK (fitness_level BETWEEN 0 AND 100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 疾病和健康事件表
CREATE TABLE health_conditions (
    condition_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    condition_name VARCHAR(100) NOT NULL,
    condition_type VARCHAR(50) NOT NULL, -- 'acute', 'chronic', 'genetic', 'injury'
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
    onset_age INTEGER NOT NULL,
    recovery_age INTEGER, -- NULL表示未恢复
    impact_attributes JSONB, -- 对属性的影响
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.2.6 成就系统表

```sql
-- 成就定义表
CREATE TABLE achievements (
    achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    achievement_name VARCHAR(200) NOT NULL,
    achievement_type VARCHAR(50) NOT NULL, -- 'career', 'family', 'social', 'personal', 'special'
    description TEXT NOT NULL,
    requirements JSONB NOT NULL, -- 获得条件
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'uncommon', 'rare', 'legendary'
    points INTEGER DEFAULT 10,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色成就表
CREATE TABLE character_achievements (
    char_achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(character_id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(achievement_id),
    achieved_at_age INTEGER NOT NULL,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(character_id, achievement_id)
);
```

### 2.3 索引优化策略

```sql
-- 性能关键索引
CREATE INDEX CONCURRENTLY idx_characters_user_id ON characters(user_id);
CREATE INDEX CONCURRENTLY idx_character_events_character_age ON character_events(character_id, event_age);
CREATE INDEX CONCURRENTLY idx_character_relationships_character ON character_relationships(character_id) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_event_templates_type_era ON event_templates(event_type, era_start, era_end) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_character_attributes_character ON character_attributes(character_id);
CREATE INDEX CONCURRENTLY idx_character_health_character_age ON character_health(character_id, current_age);

-- 复合索引用于复杂查询
CREATE INDEX CONCURRENTLY idx_events_character_type_age ON character_events(character_id, template_id, event_age);
CREATE INDEX CONCURRENTLY idx_relationships_type_active ON character_relationships(character_id, relationship_type_id) WHERE is_active = true;
```

### 2.4 数据分区策略

```sql
-- 事件历史表按年份分区
CREATE TABLE character_events_2020 PARTITION OF character_events
FOR VALUES FROM (2020) TO (2021);

CREATE TABLE character_events_2021 PARTITION OF character_events
FOR VALUES FROM (2021) TO (2022);

-- 自动创建新分区的函数
CREATE OR REPLACE FUNCTION create_yearly_partitions()
RETURNS void AS $$
DECLARE
    year_val integer;
BEGIN
    year_val := EXTRACT(YEAR FROM CURRENT_DATE);
    EXECUTE format('CREATE TABLE IF NOT EXISTS character_events_%s PARTITION OF character_events 
                   FOR VALUES FROM (%s) TO (%s)', 
                   year_val, year_val, year_val + 1);
END;
$$ LANGUAGE plpgsql;
```

## 3. API设计

### 3.1 RESTful API设计原则

遵循REST架构风格，使用标准HTTP状态码和JSON格式数据交换。基于[Go官方RESTful API教程](https://go.dev/doc/tutorial/web-service-gin)，我们使用Gin框架构建高性能的API服务。

### 3.2 Go项目结构

```
restart-life-api/
├── cmd/
│   └── server/
│       └── main.go              # 应用程序入口点
├── internal/
│   ├── api/
│   │   ├── handlers/            # HTTP处理器
│   │   │   ├── auth.go
│   │   │   ├── character.go
│   │   │   ├── game.go
│   │   │   └── achievement.go
│   │   ├── middleware/          # 中间件
│   │   │   ├── auth.go
│   │   │   ├── cors.go
│   │   │   └── ratelimit.go
│   │   └── routes/              # 路由定义
│   │       └── routes.go
│   ├── models/                  # 数据模型
│   │   ├── user.go
│   │   ├── character.go
│   │   ├── event.go
│   │   └── achievement.go
│   ├── services/                # 业务逻辑服务
│   │   ├── character_service.go
│   │   ├── game_service.go
│   │   └── event_service.go
│   ├── repository/              # 数据访问层
│   │   ├── postgres/
│   │   │   ├── character_repo.go
│   │   │   ├── event_repo.go
│   │   │   └── user_repo.go
│   │   └── redis/
│   │       └── cache_repo.go
│   └── config/                  # 配置管理
│       └── config.go
├── pkg/
│   ├── utils/                   # 工具函数
│   │   ├── jwt.go
│   │   ├── password.go
│   │   └── validator.go
│   └── database/                # 数据库连接
│       ├── postgres.go
│       └── redis.go
├── migrations/                  # 数据库迁移文件
├── docs/                        # API文档
├── docker/
│   └── Dockerfile
├── go.mod
├── go.sum
└── README.md
```

### 3.3 核心数据结构定义

```go
// internal/models/character.go
package models

import (
    "time"
    "github.com/google/uuid"
)

// Character 角色模型
type Character struct {
    ID            uuid.UUID              `json:"id" db:"character_id"`
    UserID        uuid.UUID              `json:"user_id" db:"user_id"`
    Name          string                 `json:"character_name" db:"character_name"`
    BirthCountry  string                 `json:"birth_country" db:"birth_country"`
    BirthYear     int                    `json:"birth_year" db:"birth_year"`
    CurrentAge    int                    `json:"current_age" db:"current_age"`
    Gender        string                 `json:"gender" db:"gender"`
    Race          string                 `json:"race" db:"race"`
    IsActive      bool                   `json:"is_active" db:"is_active"`
    CreatedAt     time.Time              `json:"created_at" db:"created_at"`
    UpdatedAt     time.Time              `json:"updated_at" db:"updated_at"`
    
    // 关联数据
    Attributes    *CharacterAttributes   `json:"attributes,omitempty"`
    Health        *CharacterHealth       `json:"health,omitempty"`
    Economics     *CharacterEconomics    `json:"economics,omitempty"`
    Relationships []CharacterRelationship `json:"relationships,omitempty"`
}

// CharacterAttributes 角色属性
type CharacterAttributes struct {
    AttributeID    uuid.UUID `json:"attribute_id" db:"attribute_id"`
    CharacterID    uuid.UUID `json:"character_id" db:"character_id"`
    Intelligence   int       `json:"intelligence" db:"intelligence"`
    Constitution   int       `json:"constitution" db:"constitution"`
    Charisma       int       `json:"charisma" db:"charisma"`
    Willpower      int       `json:"willpower" db:"willpower"`
    Creativity     int       `json:"creativity" db:"creativity"`
    AcademicSkill  int       `json:"academic_skill" db:"academic_skill"`
    SocialSkill    int       `json:"social_skill" db:"social_skill"`
    AthleticSkill  int       `json:"athletic_skill" db:"athletic_skill"`
    ArtisticSkill  int       `json:"artistic_skill" db:"artistic_skill"`
    BusinessSkill  int       `json:"business_skill" db:"business_skill"`
    UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

// GameEvent 游戏事件
type GameEvent struct {
    EventID      uuid.UUID              `json:"event_id" db:"event_id"`
    CharacterID  uuid.UUID              `json:"character_id" db:"character_id"`
    TemplateID   uuid.UUID              `json:"template_id" db:"template_id"`
    EventAge     int                    `json:"event_age" db:"event_age"`
    ChosenOption *uuid.UUID             `json:"chosen_option_id" db:"chosen_option_id"`
    EventResult  map[string]interface{} `json:"event_result" db:"event_result"`
    CreatedAt    time.Time              `json:"created_at" db:"created_at"`
    
    // 关联数据
    Template     *EventTemplate         `json:"template,omitempty"`
    Choice       *EventChoice           `json:"choice,omitempty"`
}

// AdvanceRequest 推进请求
type AdvanceRequest struct {
    AdvanceMode string `json:"advance_mode" validate:"required,oneof=conservative stable aggressive"`
}

// AdvanceResponse 推进响应
type AdvanceResponse struct {
    NewAge            int                        `json:"new_age"`
    Events            []GameEvent                `json:"events"`
    AttributeChanges  map[string]int             `json:"attribute_changes"`
    NewRelationships  []CharacterRelationship    `json:"new_relationships"`
    NewAchievements   []string                   `json:"new_achievements"`
}
```

### 3.4 API接口定义

#### 3.4.1 用户管理API实现

```go
// internal/api/handlers/auth.go
package handlers

import (
    "net/http"
    "restart-life-api/internal/models"
    "restart-life-api/internal/services"
    "restart-life-api/pkg/utils"
    
    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
)

type AuthHandler struct {
    authService *services.AuthService
    validator   *validator.Validate
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
    return &AuthHandler{
        authService: authService,
        validator:   validator.New(),
    }
}

// RegisterRequest 注册请求结构
type RegisterRequest struct {
    Username string `json:"username" validate:"required,min=3,max=50"`
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=6"`
}

// LoginRequest 登录请求结构
type LoginRequest struct {
    Username string `json:"username" validate:"required"`
    Password string `json:"password" validate:"required"`
}

// AuthResponse 认证响应结构
type AuthResponse struct {
    UserID    string `json:"user_id"`
    Username  string `json:"username"`
    Token     string `json:"token"`
    ExpiresIn int    `json:"expires_in"`
}

// Register 用户注册
// @Summary 用户注册
// @Description 创建新用户账户
// @Tags auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "注册信息"
// @Success 201 {object} AuthResponse
// @Failure 400 {object} ErrorResponse
// @Router /api/v1/auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
    var req RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
        return
    }

    if err := h.validator.Struct(req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "数据验证失败", "details": err.Error()})
        return
    }

    user, token, err := h.authService.Register(req.Username, req.Email, req.Password)
    if err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
        return
    }

    response := AuthResponse{
        UserID:    user.ID.String(),
        Username:  user.Username,
        Token:     token,
        ExpiresIn: 3600,
    }

    c.JSON(http.StatusCreated, response)
}

// Login 用户登录
// @Summary 用户登录
// @Description 用户身份验证
// @Tags auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "登录信息"
// @Success 200 {object} AuthResponse
// @Failure 401 {object} ErrorResponse
// @Router /api/v1/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
        return
    }

    if err := h.validator.Struct(req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "数据验证失败"})
        return
    }

    user, token, err := h.authService.Login(req.Username, req.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})
        return
    }

    response := AuthResponse{
        UserID:    user.ID.String(),
        Username:  user.Username,
        Token:     token,
        ExpiresIn: 3600,
    }

    c.JSON(http.StatusOK, response)
}

// RefreshToken 刷新令牌
// @Summary 刷新访问令牌
// @Description 使用现有令牌获取新的访问令牌
// @Tags auth
// @Security BearerAuth
// @Produce json
// @Success 200 {object} AuthResponse
// @Failure 401 {object} ErrorResponse
// @Router /api/v1/auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的令牌"})
        return
    }

    user, token, err := h.authService.RefreshToken(userID.(string))
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "令牌刷新失败"})
        return
    }

    response := AuthResponse{
        UserID:    user.ID.String(),
        Username:  user.Username,
        Token:     token,
        ExpiresIn: 3600,
    }

    c.JSON(http.StatusOK, response)
}
```

#### 3.4.2 角色管理API实现

```go
// internal/api/handlers/character.go
package handlers

import (
    "net/http"
    "strconv"
    "restart-life-api/internal/models"
    "restart-life-api/internal/services"
    
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type CharacterHandler struct {
    characterService *services.CharacterService
}

func NewCharacterHandler(characterService *services.CharacterService) *CharacterHandler {
    return &CharacterHandler{
        characterService: characterService,
    }
}

// CreateCharacterRequest 创建角色请求
type CreateCharacterRequest struct {
    CharacterName string `json:"character_name" validate:"required,min=1,max=100"`
    BirthCountry  string `json:"birth_country" validate:"required"`
    BirthYear     int    `json:"birth_year" validate:"required,min=1800,max=2050"`
    Gender        string `json:"gender" validate:"required,oneof=male female other"`
    Race          string `json:"race" validate:"required"`
}

// CreateCharacter 创建新角色
// @Summary 创建新角色
// @Description 为当前用户创建一个新的游戏角色
// @Tags characters
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body CreateCharacterRequest true "角色信息"
// @Success 201 {object} models.Character
// @Failure 400 {object} ErrorResponse
// @Router /api/v1/characters [post]
func (h *CharacterHandler) CreateCharacter(c *gin.Context) {
    userID, _ := c.Get("user_id")
    
    var req CreateCharacterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
        return
    }

    character, err := h.characterService.CreateCharacter(userID.(string), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, character)
}

// GetCharacters 获取角色列表
// @Summary 获取用户的角色列表
// @Description 获取当前用户的所有角色
// @Tags characters
// @Security BearerAuth
// @Produce json
// @Param is_active query bool false "是否只获取活跃角色"
// @Param limit query int false "每页数量" default(10)
// @Param offset query int false "偏移量" default(0)
// @Success 200 {object} CharacterListResponse
// @Router /api/v1/characters [get]
func (h *CharacterHandler) GetCharacters(c *gin.Context) {
    userID, _ := c.Get("user_id")
    
    // 解析查询参数
    isActiveStr := c.DefaultQuery("is_active", "true")
    limitStr := c.DefaultQuery("limit", "10")
    offsetStr := c.DefaultQuery("offset", "0")
    
    isActive, _ := strconv.ParseBool(isActiveStr)
    limit, _ := strconv.Atoi(limitStr)
    offset, _ := strconv.Atoi(offsetStr)

    characters, total, err := h.characterService.GetCharactersByUserID(
        userID.(string), isActive, limit, offset)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    response := gin.H{
        "characters": characters,
        "total":      total,
        "limit":      limit,
        "offset":     offset,
    }

    c.JSON(http.StatusOK, response)
}

// GetCharacterByID 获取角色详情
// @Summary 获取角色详情
// @Description 根据ID获取角色的完整信息
// @Tags characters
// @Security BearerAuth
// @Produce json
// @Param id path string true "角色ID"
// @Success 200 {object} models.Character
// @Failure 404 {object} ErrorResponse
// @Router /api/v1/characters/{id} [get]
func (h *CharacterHandler) GetCharacterByID(c *gin.Context) {
    characterID := c.Param("id")
    userID, _ := c.Get("user_id")

    // 验证UUID格式
    if _, err := uuid.Parse(characterID); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID格式"})
        return
    }

    character, err := h.characterService.GetCharacterByID(characterID, userID.(string))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "角色不存在"})
        return
    }

    c.JSON(http.StatusOK, character)
}

// DeleteCharacter 删除角色
// @Summary 删除角色
// @Description 软删除指定的角色
// @Tags characters
// @Security BearerAuth
// @Param id path string true "角色ID"
// @Success 204
// @Failure 404 {object} ErrorResponse
// @Router /api/v1/characters/{id} [delete]
func (h *CharacterHandler) DeleteCharacter(c *gin.Context) {
    characterID := c.Param("id")
    userID, _ := c.Get("user_id")

    if _, err := uuid.Parse(characterID); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID格式"})
        return
    }

    err := h.characterService.DeleteCharacter(characterID, userID.(string))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "角色不存在"})
        return
    }

    c.Status(http.StatusNoContent)
}
```

#### 3.4.3 游戏进程API实现

```go
// internal/api/handlers/game.go
package handlers

import (
    "net/http"
    "restart-life-api/internal/models"
    "restart-life-api/internal/services"
    
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type GameHandler struct {
    gameService *services.GameService
}

func NewGameHandler(gameService *services.GameService) *GameHandler {
    return &GameHandler{
        gameService: gameService,
    }
}

// AdvanceCharacter 推进角色人生
// @Summary 推进角色人生一年
// @Description 根据指定模式推进角色的人生进程
// @Tags game
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "角色ID"
// @Param request body models.AdvanceRequest true "推进请求"
// @Success 200 {object} models.AdvanceResponse
// @Failure 400 {object} ErrorResponse
// @Router /api/v1/characters/{id}/advance [post]
func (h *GameHandler) AdvanceCharacter(c *gin.Context) {
    characterID := c.Param("id")
    userID, _ := c.Get("user_id")
    
    if _, err := uuid.Parse(characterID); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID格式"})
        return
    }

    var req models.AdvanceRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
        return
    }

    // 验证推进模式
    if req.AdvanceMode != "conservative" && req.AdvanceMode != "stable" && req.AdvanceMode != "aggressive" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的推进模式"})
        return
    }

    response, err := h.gameService.AdvanceCharacter(characterID, userID.(string), req.AdvanceMode)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, response)
}

// MakeChoice 做出选择
// @Summary 对事件做出选择
// @Description 为指定事件选择一个选项
// @Tags game
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param character_id path string true "角色ID"
// @Param event_id path string true "事件ID"
// @Param request body ChoiceRequest true "选择请求"
// @Success 200 {object} ChoiceResponse
// @Failure 400 {object} ErrorResponse
// @Router /api/v1/characters/{character_id}/events/{event_id}/choose [post]
func (h *GameHandler) MakeChoice(c *gin.Context) {
    characterID := c.Param("character_id")
    eventID := c.Param("event_id")
    userID, _ := c.Get("user_id")

    var req struct {
        ChoiceID string `json:"choice_id" validate:"required"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
        return
    }

    result, err := h.gameService.MakeChoice(characterID, eventID, req.ChoiceID, userID.(string))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, result)
}

// GetCharacterEvents 获取角色事件历史
// @Summary 获取角色事件历史
// @Description 获取角色的历史事件记录
// @Tags game
// @Security BearerAuth
// @Produce json
// @Param id path string true "角色ID"
// @Param start_age query int false "开始年龄"
// @Param end_age query int false "结束年龄"
// @Param event_type query string false "事件类型"
// @Param limit query int false "每页数量" default(50)
// @Param offset query int false "偏移量" default(0)
// @Success 200 {object} EventHistoryResponse
// @Router /api/v1/characters/{id}/events [get]
func (h *GameHandler) GetCharacterEvents(c *gin.Context) {
    characterID := c.Param("id")
    userID, _ := c.Get("user_id")

    // 解析查询参数
    startAge, _ := strconv.Atoi(c.Query("start_age"))
    endAge, _ := strconv.Atoi(c.Query("end_age"))
    eventType := c.Query("event_type")
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
    offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

    events, total, err := h.gameService.GetCharacterEvents(
        characterID, userID.(string), startAge, endAge, eventType, limit, offset)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    response := gin.H{
        "events": events,
        "total":  total,
        "limit":  limit,
        "offset": offset,
    }

    c.JSON(http.StatusOK, response)
}
```

```typescript
// 创建新角色
POST /api/v1/characters
Headers: Authorization: Bearer <token>
Request Body:
{
  "character_name": "string",
  "birth_country": "string",
  "birth_year": 1990,
  "gender": "male|female|other",
  "race": "string"
}
Response: 201 Created
{
  "character_id": "uuid",
  "character_name": "string",
  "birth_country": "string",
  "birth_year": 1990,
  "current_age": 0,
  "attributes": {
    "intelligence": 75,
    "constitution": 80,
    "charisma": 65,
    "willpower": 70,
    "creativity": 60
  },
  "skills": {
    "academic_skill": 0,
    "social_skill": 0,
    "athletic_skill": 0,
    "artistic_skill": 0,
    "business_skill": 0
  }
}

// 获取角色列表
GET /api/v1/characters
Headers: Authorization: Bearer <token>
Query Parameters:
- is_active: boolean (optional)
- limit: integer (default: 10)
- offset: integer (default: 0)
Response: 200 OK
{
  "characters": [
    {
      "character_id": "uuid",
      "character_name": "string",
      "current_age": 25,
      "birth_country": "string",
      "is_active": true,
      "created_at": "2025-01-26T10:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}

// 获取角色详情
GET /api/v1/characters/{character_id}
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "character_id": "uuid",
  "character_name": "string",
  "birth_country": "string",
  "birth_year": 1990,
  "current_age": 25,
  "attributes": {...},
  "skills": {...},
  "health": {
    "physical_health": 85,
    "mental_health": 90,
    "stress_level": 15
  },
  "economics": {
    "cash_amount": 50000.00,
    "annual_income": 80000.00,
    "occupation": "Software Developer"
  }
}

// 删除角色（软删除）
DELETE /api/v1/characters/{character_id}
Headers: Authorization: Bearer <token>
Response: 204 No Content
```

#### 3.2.3 游戏进程API

```typescript
// 推进一年
POST /api/v1/characters/{character_id}/advance
Headers: Authorization: Bearer <token>
Request Body:
{
  "advance_mode": "conservative|stable|aggressive"
}
Response: 200 OK
{
  "new_age": 26,
  "events": [
    {
      "event_id": "uuid",
      "event_name": "Job Promotion",
      "description": "You were promoted to Senior Developer",
      "event_type": "development",
      "choices": [
        {
          "choice_id": "uuid",
          "choice_text": "Accept the promotion",
          "effects": {
            "attribute_changes": {"intelligence": +2},
            "economic_changes": {"annual_income": +15000}
          }
        },
        {
          "choice_id": "uuid", 
          "choice_text": "Decline and look for other opportunities",
          "effects": {
            "attribute_changes": {"willpower": +1},
            "relationship_changes": {"boss": {"trust": -10}}
          }
        }
      ]
    }
  ],
  "attribute_changes": {
    "intelligence": +1,
    "constitution": -1
  },
  "new_relationships": [
    {
      "npc_name": "Alice Johnson",
      "relationship_type": "colleague",
      "intimacy_level": 30
    }
  ]
}

// 做出选择
POST /api/v1/characters/{character_id}/events/{event_id}/choose
Headers: Authorization: Bearer <token>
Request Body:
{
  "choice_id": "uuid"
}
Response: 200 OK
{
  "choice_result": {
    "description": "You accepted the promotion and became a Senior Developer",
    "attribute_changes": {"intelligence": +2},
    "economic_changes": {"annual_income": +15000},
    "relationship_changes": {},
    "new_achievements": ["First Promotion"]
  }
}

// 获取角色事件历史
GET /api/v1/characters/{character_id}/events
Headers: Authorization: Bearer <token>
Query Parameters:
- start_age: integer (optional)
- end_age: integer (optional)
- event_type: string (optional)
- limit: integer (default: 50)
- offset: integer (default: 0)
Response: 200 OK
{
  "events": [
    {
      "event_id": "uuid",
      "event_age": 25,
      "event_name": "Job Promotion",
      "event_type": "development",
      "chosen_option": "Accept the promotion",
      "event_result": {...},
      "created_at": "2025-01-26T10:00:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

#### 3.2.4 关系系统API

```typescript
// 获取角色关系网络
GET /api/v1/characters/{character_id}/relationships
Headers: Authorization: Bearer <token>
Query Parameters:
- relationship_type: string (optional)
- is_active: boolean (default: true)
Response: 200 OK
{
  "relationships": [
    {
      "relationship_id": "uuid",
      "npc_name": "John Smith",
      "relationship_type": "friend",
      "intimacy_level": 75,
      "trust_level": 80,
      "support_level": 70,
      "start_age": 18,
      "relationship_duration": 7
    }
  ]
}

// 更新关系状态
PATCH /api/v1/characters/{character_id}/relationships/{relationship_id}
Headers: Authorization: Bearer <token>
Request Body:
{
  "intimacy_level": 80,
  "trust_level": 85,
  "support_level": 75
}
Response: 200 OK
{
  "relationship_id": "uuid",
  "updated_values": {
    "intimacy_level": 80,
    "trust_level": 85,
    "support_level": 75
  }
}
```

#### 3.2.5 成就系统API

```typescript
// 获取角色成就
GET /api/v1/characters/{character_id}/achievements
Headers: Authorization: Bearer <token>
Query Parameters:
- achievement_type: string (optional)
- rarity: string (optional)
Response: 200 OK
{
  "achievements": [
    {
      "achievement_id": "uuid",
      "achievement_name": "First Job",
      "achievement_type": "career",
      "description": "Got your first job",
      "rarity": "common",
      "points": 10,
      "achieved_at_age": 22,
      "achieved_at": "2025-01-26T10:00:00Z"
    }
  ],
  "total_points": 150,
  "achievement_count": 15
}

// 获取所有可用成就
GET /api/v1/achievements
Query Parameters:
- achievement_type: string (optional)
- rarity: string (optional)
- is_active: boolean (default: true)
Response: 200 OK
{
  "achievements": [
    {
      "achievement_id": "uuid",
      "achievement_name": "Millionaire",
      "achievement_type": "financial",
      "description": "Accumulate $1,000,000 in total assets",
      "rarity": "rare",
      "points": 100,
      "requirements": {
        "total_assets": {">=": 1000000}
      }
    }
  ]
}
```

### 3.3 API错误处理

```typescript
// 标准错误响应格式
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed",
    "details": [
      {
        "field": "birth_year",
        "message": "Birth year must be between 1800 and 2050"
      }
    ],
    "timestamp": "2025-01-26T10:00:00Z",
    "trace_id": "uuid"
  }
}

// 常用错误码
enum ErrorCodes {
  INVALID_INPUT = "INVALID_INPUT",           // 400
  UNAUTHORIZED = "UNAUTHORIZED",             // 401
  FORBIDDEN = "FORBIDDEN",                   // 403
  NOT_FOUND = "NOT_FOUND",                   // 404
  CONFLICT = "CONFLICT",                     // 409
  RATE_LIMITED = "RATE_LIMITED",             // 429
  INTERNAL_ERROR = "INTERNAL_ERROR",         // 500
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE" // 503
}
```

### 3.4 API安全和限流

```typescript
// JWT Token结构
{
  "sub": "user_id",
  "username": "string",
  "iat": 1643723400,
  "exp": 1643726400,
  "permissions": ["character:read", "character:write"]
}

// 限流策略
Rate Limits:
- Login attempts: 5 per minute per IP
- Character creation: 3 per hour per user
- Game advance: 100 per hour per character
- API calls (general): 1000 per hour per user
```

## 4. 性能优化方案

### 4.1 数据库优化

```sql
-- 连接池配置
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB

-- 查询优化
EXPLAIN ANALYZE SELECT * FROM character_events 
WHERE character_id = ? AND event_age BETWEEN ? AND ?;

-- 定期维护
VACUUM ANALYZE character_events;
REINDEX INDEX CONCURRENTLY idx_character_events_character_age;
```

### 4.2 Go依赖管理和配置

#### 4.2.1 go.mod文件配置

```go
// go.mod
module restart-life-api

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
    github.com/google/uuid v1.3.0
    github.com/golang-jwt/jwt/v5 v5.0.0
    github.com/go-playground/validator/v10 v10.15.5
    github.com/go-redis/redis/v8 v8.11.5
    github.com/spf13/viper v1.16.0
    github.com/swaggo/gin-swagger v1.6.0
    github.com/swaggo/files v1.0.1
    github.com/swaggo/swag v1.16.1
    golang.org/x/crypto v0.14.0
    github.com/joho/godotenv v1.4.0
)
```

#### 4.2.2 数据库连接配置

```go
// pkg/database/postgres.go
package database

import (
    "database/sql"
    "fmt"
    "time"
    
    _ "github.com/lib/pq"
)

type PostgresConfig struct {
    Host         string
    Port         int
    User         string
    Password     string
    DBName       string
    SSLMode      string
    MaxOpenConns int
    MaxIdleConns int
    MaxLifetime  time.Duration
}

func NewPostgresConnection(config *PostgresConfig) (*sql.DB, error) {
    dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
        config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode)
    
    db, err := sql.Open("postgres", dsn)
    if err != nil {
        return nil, fmt.Errorf("failed to open database: %w", err)
    }
    
    // 配置连接池
    db.SetMaxOpenConns(config.MaxOpenConns)
    db.SetMaxIdleConns(config.MaxIdleConns)
    db.SetConnMaxLifetime(config.MaxLifetime)
    
    // 测试连接
    if err := db.Ping(); err != nil {
        return nil, fmt.Errorf("failed to ping database: %w", err)
    }
    
    fmt.Println("Successfully connected to PostgreSQL database")
    return db, nil
}
```

#### 4.2.3 Redis缓存配置

```go
// pkg/database/redis.go
package database

import (
    "context"
    "fmt"
    "time"
    
    "github.com/go-redis/redis/v8"
)

type RedisConfig struct {
    Host         string
    Port         int
    Password     string
    DB           int
    PoolSize     int
    MinIdleConns int
}

func NewRedisClient(config *RedisConfig) (*redis.Client, error) {
    rdb := redis.NewClient(&redis.Options{
        Addr:         fmt.Sprintf("%s:%d", config.Host, config.Port),
        Password:     config.Password,
        DB:           config.DB,
        PoolSize:     config.PoolSize,
        MinIdleConns: config.MinIdleConns,
    })
    
    // 测试连接
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    _, err := rdb.Ping(ctx).Result()
    if err != nil {
        return nil, fmt.Errorf("failed to connect to Redis: %w", err)
    }
    
    fmt.Println("Successfully connected to Redis")
    return rdb, nil
}
```

#### 4.2.4 应用配置管理

```go
// internal/config/config.go
package config

import (
    "fmt"
    "restart-life-api/pkg/database"
    "time"
    
    "github.com/spf13/viper"
)

type Config struct {
    Server   ServerConfig            `mapstructure:"server"`
    Database database.PostgresConfig `mapstructure:"database"`
    Redis    database.RedisConfig    `mapstructure:"redis"`
    JWT      JWTConfig              `mapstructure:"jwt"`
    App      AppConfig              `mapstructure:"app"`
}

type ServerConfig struct {
    Port         int           `mapstructure:"port"`
    Host         string        `mapstructure:"host"`
    ReadTimeout  time.Duration `mapstructure:"read_timeout"`
    WriteTimeout time.Duration `mapstructure:"write_timeout"`
    IdleTimeout  time.Duration `mapstructure:"idle_timeout"`
}

type JWTConfig struct {
    SecretKey   string        `mapstructure:"secret_key"`
    ExpiresIn   time.Duration `mapstructure:"expires_in"`
    RefreshIn   time.Duration `mapstructure:"refresh_in"`
}

type AppConfig struct {
    Name        string `mapstructure:"name"`
    Version     string `mapstructure:"version"`
    Environment string `mapstructure:"environment"`
    LogLevel    string `mapstructure:"log_level"`
}

func LoadConfig(configPath string) (*Config, error) {
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath(configPath)
    viper.AddConfigPath(".")
    
    // 设置环境变量前缀
    viper.SetEnvPrefix("RESTART_LIFE")
    viper.AutomaticEnv()
    
    // 设置默认值
    setDefaults()
    
    if err := viper.ReadInConfig(); err != nil {
        return nil, fmt.Errorf("failed to read config file: %w", err)
    }
    
    var config Config
    if err := viper.Unmarshal(&config); err != nil {
        return nil, fmt.Errorf("failed to unmarshal config: %w", err)
    }
    
    return &config, nil
}

func setDefaults() {
    // Server defaults
    viper.SetDefault("server.port", 8080)
    viper.SetDefault("server.host", "localhost")
    viper.SetDefault("server.read_timeout", "10s")
    viper.SetDefault("server.write_timeout", "10s")
    viper.SetDefault("server.idle_timeout", "60s")
    
    // Database defaults
    viper.SetDefault("database.host", "localhost")
    viper.SetDefault("database.port", 5432)
    viper.SetDefault("database.user", "postgres")
    viper.SetDefault("database.dbname", "restart_life_db")
    viper.SetDefault("database.sslmode", "disable")
    viper.SetDefault("database.max_open_conns", 25)
    viper.SetDefault("database.max_idle_conns", 5)
    viper.SetDefault("database.max_lifetime", "15m")
    
    // Redis defaults
    viper.SetDefault("redis.host", "localhost")
    viper.SetDefault("redis.port", 6379)
    viper.SetDefault("redis.db", 0)
    viper.SetDefault("redis.pool_size", 10)
    viper.SetDefault("redis.min_idle_conns", 2)
    
    // JWT defaults
    viper.SetDefault("jwt.expires_in", "1h")
    viper.SetDefault("jwt.refresh_in", "168h") // 7 days
    
    // App defaults
    viper.SetDefault("app.name", "Restart Life API")
    viper.SetDefault("app.version", "1.0.0")
    viper.SetDefault("app.environment", "development")
    viper.SetDefault("app.log_level", "info")
}
```

#### 4.2.5 主程序入口

```go
// cmd/server/main.go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"
    
    "restart-life-api/internal/api/handlers"
    "restart-life-api/internal/api/middleware"
    "restart-life-api/internal/api/routes"
    "restart-life-api/internal/config"
    "restart-life-api/internal/repository/postgres"
    "restart-life-api/internal/repository/redis"
    "restart-life-api/internal/services"
    "restart-life-api/pkg/database"
    
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    // 加载环境变量
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }
    
    // 加载配置
    cfg, err := config.LoadConfig(".")
    if err != nil {
        log.Fatalf("Failed to load config: %v", err)
    }
    
    // 连接数据库
    db, err := database.NewPostgresConnection(&cfg.Database)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()
    
    // 连接Redis
    rdb, err := database.NewRedisClient(&cfg.Redis)
    if err != nil {
        log.Fatalf("Failed to connect to Redis: %v", err)
    }
    defer rdb.Close()
    
    // 初始化仓储层
    userRepo := postgres.NewUserRepository(db)
    characterRepo := postgres.NewCharacterRepository(db)
    eventRepo := postgres.NewEventRepository(db)
    cacheRepo := redis.NewCacheRepository(rdb)
    
    // 初始化服务层
    authService := services.NewAuthService(userRepo, cacheRepo, &cfg.JWT)
    characterService := services.NewCharacterService(characterRepo, cacheRepo)
    gameService := services.NewGameService(characterRepo, eventRepo, cacheRepo)
    
    // 初始化处理器
    authHandler := handlers.NewAuthHandler(authService)
    characterHandler := handlers.NewCharacterHandler(characterService)
    gameHandler := handlers.NewGameHandler(gameService)
    
    // 设置Gin模式
    if cfg.App.Environment == "production" {
        gin.SetMode(gin.ReleaseMode)
    }
    
    // 创建路由
    router := gin.New()
    router.Use(gin.Logger())
    router.Use(gin.Recovery())
    router.Use(middleware.CORS())
    
    // 注册路由
    routes.RegisterRoutes(router, authHandler, characterHandler, gameHandler)
    
    // 创建HTTP服务器
    server := &http.Server{
        Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port),
        Handler:      router,
        ReadTimeout:  cfg.Server.ReadTimeout,
        WriteTimeout: cfg.Server.WriteTimeout,
        IdleTimeout:  cfg.Server.IdleTimeout,
    }
    
    // 启动服务器
    go func() {
        fmt.Printf("Server starting on %s:%d\n", cfg.Server.Host, cfg.Server.Port)
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server failed to start: %v", err)
        }
    }()
    
    // 优雅关闭
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    
    fmt.Println("Shutting down server...")
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    
    if err := server.Shutdown(ctx); err != nil {
        log.Fatalf("Server forced to shutdown: %v", err)
    }
    
    fmt.Println("Server exited")
}
```

### 4.3 缓存策略

```go
// internal/repository/redis/cache_repo.go
package redis

import (
    "context"
    "encoding/json"
    "fmt"
    "time"
    
    "github.com/go-redis/redis/v8"
)

// 缓存键命名规范
const (
    CharacterDetailsKey    = "char:details:%s"
    CharacterAttributesKey = "char:attrs:%s"
    UserCharactersKey      = "user:chars:%s"
    EventTemplatesKey      = "events:templates:%s:%d"
    AchievementsKey        = "achievements:all"
    UserSessionKey         = "session:user:%s"
)

// 缓存TTL设置
const (
    CharacterDetailsTTL    = 5 * time.Minute
    CharacterAttributesTTL = 10 * time.Minute
    EventTemplatesTTL      = 1 * time.Hour
    AchievementsTTL        = 24 * time.Hour
    UserSessionTTL         = 24 * time.Hour
)

type CacheRepository struct {
    client *redis.Client
}

func NewCacheRepository(client *redis.Client) *CacheRepository {
    return &CacheRepository{
        client: client,
    }
}

// Set 设置缓存
func (r *CacheRepository) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
    data, err := json.Marshal(value)
    if err != nil {
        return fmt.Errorf("failed to marshal value: %w", err)
    }
    
    return r.client.Set(ctx, key, data, ttl).Err()
}

// Get 获取缓存
func (r *CacheRepository) Get(ctx context.Context, key string, dest interface{}) error {
    data, err := r.client.Get(ctx, key).Result()
    if err != nil {
        if err == redis.Nil {
            return fmt.Errorf("cache miss for key: %s", key)
        }
        return fmt.Errorf("failed to get cache: %w", err)
    }
    
    return json.Unmarshal([]byte(data), dest)
}

// Delete 删除缓存
func (r *CacheRepository) Delete(ctx context.Context, keys ...string) error {
    return r.client.Del(ctx, keys...).Err()
}

// SetCharacterDetails 缓存角色详情
func (r *CacheRepository) SetCharacterDetails(ctx context.Context, characterID string, character interface{}) error {
    key := fmt.Sprintf(CharacterDetailsKey, characterID)
    return r.Set(ctx, key, character, CharacterDetailsTTL)
}

// GetCharacterDetails 获取角色详情缓存
func (r *CacheRepository) GetCharacterDetails(ctx context.Context, characterID string, dest interface{}) error {
    key := fmt.Sprintf(CharacterDetailsKey, characterID)
    return r.Get(ctx, key, dest)
}

// InvalidateCharacterCache 清除角色相关缓存
func (r *CacheRepository) InvalidateCharacterCache(ctx context.Context, characterID, userID string) error {
    keys := []string{
        fmt.Sprintf(CharacterDetailsKey, characterID),
        fmt.Sprintf(CharacterAttributesKey, characterID),
        fmt.Sprintf(UserCharactersKey, userID),
    }
    return r.Delete(ctx, keys...)
}
```

### 4.4 监控和日志

```go
// pkg/monitoring/metrics.go
package monitoring

import (
    "time"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
)

var (
    // HTTP请求指标
    HTTPRequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "http_request_duration_seconds",
            Help: "HTTP请求处理时间",
        },
        []string{"method", "endpoint", "status_code"},
    )

    // 数据库查询指标
    DatabaseQueryDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "database_query_duration_seconds",
            Help: "数据库查询时间",
        },
        []string{"query_type", "table"},
    )

    // 缓存命中率
    CacheHitRate = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "cache_hits_total",
            Help: "缓存命中次数",
        },
        []string{"cache_type", "hit_miss"},
    )

    // 活跃用户数
    ActiveUsers = promauto.NewGauge(
        prometheus.GaugeOpts{
            Name: "active_users_current",
            Help: "当前活跃用户数",
        },
    )

    // 游戏操作指标
    GameAdvances = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "game_advances_total",
            Help: "游戏推进操作总数",
        },
        []string{"advance_mode"},
    )
)

// RecordHTTPRequest 记录HTTP请求指标
func RecordHTTPRequest(method, endpoint, statusCode string, duration time.Duration) {
    HTTPRequestDuration.WithLabelValues(method, endpoint, statusCode).Observe(duration.Seconds())
}

// RecordDatabaseQuery 记录数据库查询指标
func RecordDatabaseQuery(queryType, table string, duration time.Duration) {
    DatabaseQueryDuration.WithLabelValues(queryType, table).Observe(duration.Seconds())
}

// RecordCacheOperation 记录缓存操作指标
func RecordCacheOperation(cacheType string, hit bool) {
    hitMiss := "miss"
    if hit {
        hitMiss = "hit"
    }
    CacheHitRate.WithLabelValues(cacheType, hitMiss).Inc()
}
```

#### 结构化日志

```go
// pkg/logger/logger.go
package logger

import (
    "context"
    "os"
    "time"
    
    "github.com/sirupsen/logrus"
    "github.com/google/uuid"
)

type Logger struct {
    *logrus.Logger
}

type LogEntry struct {
    Timestamp   time.Time `json:"timestamp"`
    Level       string    `json:"level"`
    Service     string    `json:"service"`
    TraceID     string    `json:"trace_id,omitempty"`
    UserID      string    `json:"user_id,omitempty"`
    CharacterID string    `json:"character_id,omitempty"`
    Action      string    `json:"action"`
    DurationMs  int64     `json:"duration_ms,omitempty"`
    Message     string    `json:"message"`
    Error       string    `json:"error,omitempty"`
}

func NewLogger(serviceName string) *Logger {
    log := logrus.New()
    log.SetFormatter(&logrus.JSONFormatter{
        TimestampFormat: time.RFC3339,
    })
    log.SetOutput(os.Stdout)
    log.SetLevel(logrus.InfoLevel)
    
    return &Logger{Logger: log}
}

// WithContext 添加上下文信息
func (l *Logger) WithContext(ctx context.Context) *logrus.Entry {
    entry := l.WithFields(logrus.Fields{
        "service": "restart-life-api",
    })
    
    if traceID := ctx.Value("trace_id"); traceID != nil {
        entry = entry.WithField("trace_id", traceID)
    }
    
    if userID := ctx.Value("user_id"); userID != nil {
        entry = entry.WithField("user_id", userID)
    }
    
    return entry
}

// LogGameAction 记录游戏操作日志
func (l *Logger) LogGameAction(ctx context.Context, action string, characterID string, duration time.Duration) {
    l.WithContext(ctx).WithFields(logrus.Fields{
        "character_id": characterID,
        "action":       action,
        "duration_ms":  duration.Milliseconds(),
    }).Info("Game action completed")
}

// LogError 记录错误日志
func (l *Logger) LogError(ctx context.Context, action string, err error) {
    l.WithContext(ctx).WithFields(logrus.Fields{
        "action": action,
        "error":  err.Error(),
    }).Error("Operation failed")
}
```

#### 中间件集成

```go
// internal/api/middleware/logging.go
package middleware

import (
    "time"
    "restart-life-api/pkg/logger"
    "restart-life-api/pkg/monitoring"
    
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

func LoggingMiddleware(log *logger.Logger) gin.HandlerFunc {
    return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
        // 记录HTTP指标
        monitoring.RecordHTTPRequest(
            param.Method,
            param.Path,
            string(rune(param.StatusCode)),
            param.Latency,
        )
        
        // 记录访问日志
        log.WithFields(map[string]interface{}{
            "method":      param.Method,
            "path":        param.Path,
            "status_code": param.StatusCode,
            "latency_ms":  param.Latency.Milliseconds(),
            "client_ip":   param.ClientIP,
            "user_agent":  param.Request.UserAgent(),
        }).Info("HTTP request processed")
        
        return ""
    })
}

func TraceIDMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        traceID := uuid.New().String()
        c.Set("trace_id", traceID)
        c.Header("X-Trace-ID", traceID)
        c.Next()
    }
}
```

## 5. 部署和运维

### 5.1 Docker容器化

```dockerfile
# docker/Dockerfile
FROM golang:1.21-alpine AS builder

# 安装必要的工具
RUN apk add --no-cache git ca-certificates tzdata

# 设置工作目录
WORKDIR /app

# 复制go mod文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

# 最终镜像
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .
COPY --from=builder /app/config.yaml .

# 创建非root用户
RUN adduser -D -s /bin/sh appuser
USER appuser

EXPOSE 8080

CMD ["./main"]
```

#### Docker Compose配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - RESTART_LIFE_DATABASE_HOST=postgres
      - RESTART_LIFE_DATABASE_PORT=5432
      - RESTART_LIFE_DATABASE_USER=postgres
      - RESTART_LIFE_DATABASE_PASSWORD=password
      - RESTART_LIFE_DATABASE_DBNAME=restart_life_db
      - RESTART_LIFE_REDIS_HOST=redis
      - RESTART_LIFE_REDIS_PORT=6379
      - RESTART_LIFE_JWT_SECRET_KEY=your-secret-key-here
    depends_on:
      - postgres
      - redis
    networks:
      - restart-life-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=restart_life_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    networks:
      - restart-life-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - restart-life-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
    networks:
      - restart-life-network

volumes:
  postgres_data:
  redis_data:

networks:
  restart-life-network:
    driver: bridge
```

#### Nginx配置

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream api_servers {
        server api:8080;
    }

    server {
        listen 80;
        server_name localhost;

        # API代理
        location /api/ {
            proxy_pass http://api_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # CORS设置
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
            
            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }

        # 健康检查
        location /health {
            proxy_pass http://api_servers/health;
        }

        # 静态文件服务（如需要）
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### 5.2 数据备份策略

```bash
# 每日自动备份
#!/bin/bash
pg_dump -h localhost -U gameuser -d restart_life_db | 
gzip > /backups/restart_life_$(date +%Y%m%d).sql.gz

# 保留30天备份
find /backups -name "restart_life_*.sql.gz" -mtime +30 -delete
```

### 5.3 健康检查

```javascript
// API健康检查端点
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };
  
  const isHealthy = Object.values(health.services).every(
    service => service.status === 'OK'
  );
  
  res.status(isHealthy ? 200 : 503).json(health);
});
```

---

## 附录

### A. 数据库ERD图

```
[Users] ──┐
          │ 1:N
          ▼
[Characters] ──┬── 1:1 ──[Character_Attributes]
               │
               ├── 1:N ──[Character_Events] ── N:1 ──[Event_Templates]
               │                                      │
               │                                      └── 1:N ──[Event_Choices]
               │
               ├── 1:N ──[Character_Relationships] ── N:1 ──[NPCs]
               │         │
               │         └── N:1 ──[Relationship_Types]
               │
               ├── 1:N ──[Character_Economics]
               │
               ├── 1:N ──[Character_Health]
               │
               └── N:N ──[Character_Achievements] ── N:1 ──[Achievements]
```

### B. API版本控制

- v1.0: 初始版本，包含基础功能
- v1.1: 增加成就系统和关系网络
- v2.0: 计划支持多人互动功能

### C. 技术债务管理

1. **代码质量**: 使用ESLint、Prettier确保代码规范
2. **测试覆盖率**: 维持80%以上单元测试覆盖率
3. **依赖管理**: 定期更新依赖库，修复安全漏洞
4. **性能监控**: 持续监控API响应时间和数据库查询性能

---

*本技术文档将随着项目开发进展持续更新和完善。* 