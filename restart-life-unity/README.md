# 《重启人生》Unity客户端

基于Unity 2022.3 LTS开发的人生模拟游戏客户端，提供沉浸式的人生体验界面。

## 🎮 游戏概述

《重启人生》是一款文字模拟人生游戏，玩家可以：
- 选择出生国家和年代（1800-2050）
- 体验随机生成的人生轨迹
- 在关键节点做出人生选择
- 收集成就和回顾人生历程

## 🚀 快速开始

### 环境要求
- Unity 2022.3 LTS
- Visual Studio 2022 或 JetBrains Rider
- .NET Framework 4.8

### 项目设置

1. **安装Unity Hub**
   - 从[Unity官网](https://unity3d.com/get-unity/download)下载Unity Hub
   - 安装Unity 2022.3 LTS版本

2. **克隆项目**
```bash
git clone <repository-url>
cd restart-life-unity
```

3. **打开项目**
   - 启动Unity Hub
   - 点击"添加项目"并选择当前目录
   - 等待Unity导入项目资源

4. **配置API地址**
   - 编辑 `Assets/Scripts/Services/APIService.cs`
   - 设置后端API服务地址

## 📂 项目结构

```
Assets/
├── Scripts/
│   ├── Core/                    # 核心系统
│   │   ├── GameManager.cs       # 游戏管理器
│   │   ├── StateManager.cs      # 状态管理器
│   │   ├── EventSystem.cs       # 事件系统
│   │   └── DataManager.cs       # 数据管理器
│   ├── Models/                  # 数据模型
│   │   ├── Character.cs         # 角色数据模型
│   │   ├── GameEvent.cs         # 事件数据模型
│   │   └── Achievement.cs       # 成就数据模型
│   ├── Views/                   # UI视图层
│   │   ├── MainMenu/            # 主菜单界面
│   │   ├── CharacterCreation/   # 角色创建界面
│   │   ├── GamePlay/            # 主游戏界面
│   │   └── CharacterStatus/     # 状态查看界面
│   ├── Controllers/             # 控制器层
│   │   ├── MenuController.cs    # 菜单控制器
│   │   ├── GameController.cs    # 游戏控制器
│   │   └── UIController.cs      # UI控制器
│   ├── Services/                # 服务层
│   │   ├── APIService.cs        # API服务
│   │   ├── SaveService.cs       # 存档服务
│   │   └── ConfigService.cs     # 配置服务
│   └── Utils/                   # 工具类
│       ├── JsonHelper.cs        # JSON工具
│       ├── UIAnimations.cs      # UI动画工具
│       └── LocalizationHelper.cs # 本地化工具
├── UI/                          # UI资源
│   ├── Prefabs/                 # UI预制体
│   ├── Styles/                  # UI样式表
│   └── Icons/                   # 图标资源
├── Data/                        # 数据文件
│   ├── Characters/              # 角色配置
│   ├── Events/                  # 事件配置
│   └── Localization/            # 本地化文件
└── StreamingAssets/             # 流式资源
    └── Configs/                 # 配置文件
```

## 🔧 技术栈

- **游戏引擎**: Unity 2022.3 LTS
- **编程语言**: C#
- **UI系统**: Unity UI Toolkit (UI Builder)
- **网络**: Unity HTTP客户端
- **数据序列化**: Newtonsoft.Json
- **状态管理**: 自定义状态管理系统

## 🎨 UI设计

### 设计原则
- **简洁现代**: 扁平化设计风格
- **直观易用**: 用户友好的交互设计
- **响应式**: 支持多种屏幕分辨率
- **可访问性**: 支持无障碍访问

### 主要界面
- **主菜单**: 新游戏、继续游戏、成就、设置
- **角色创建**: 国家选择、年份设置、属性展示
- **游戏主界面**: 事件展示、选择决策、状态查看
- **成就系统**: 成就展示、进度追踪

## 🛠️ 开发指南

### 架构模式
项目采用MVC架构模式：
- **Model**: 数据模型（`Models/`）
- **View**: UI视图（`Views/`）
- **Controller**: 控制逻辑（`Controllers/`）

### 添加新功能

1. **定义数据模型**（`Scripts/Models/`）
2. **创建UI界面**（`UI/Prefabs/`）
3. **实现视图逻辑**（`Scripts/Views/`）
4. **添加控制器**（`Scripts/Controllers/`）
5. **注册事件监听**（`GameManager`）

### 本地化支持

```csharp
// 使用本地化文本
string localizedText = LocalizationHelper.GetText("character_name");

// 切换语言
LocalizationHelper.SetLanguage("zh-CN");
```

### API调用示例

```csharp
// 创建角色
StartCoroutine(APIService.Instance.CreateCharacter(creationData, (success, character) => {
    if (success) {
        DataManager.Instance.SetCurrentCharacter(character);
        GameManager.Instance.ChangeState(GameState.GamePlay);
    }
}));
```

## 🧪 测试

### 单元测试
```bash
# 在Unity中运行测试
Window > General > Test Runner
```

### 性能测试
- 使用Unity Profiler监控性能
- 检查内存使用情况
- 优化渲染性能

## 📦 构建发布

### 平台支持
- **PC**: Windows, macOS, Linux
- **移动端**: Android, iOS
- **Web**: WebGL

### 构建设置
1. 打开 `File > Build Settings`
2. 选择目标平台
3. 配置构建选项
4. 点击 "Build" 或 "Build And Run"

### 性能优化
- 纹理压缩
- 代码混淆
- 资源打包
- 启动优化

## 🎯 游戏特色

### 核心玩法
- **随机生成**: 每次游戏都有不同的人生体验
- **选择影响**: 玩家决策影响人生轨迹
- **时代背景**: 真实历史环境下的人生模拟
- **成长系统**: 属性成长和技能发展

### 创新功能
- **时代穿越**: 体验不同历史时期
- **文化差异**: 不同国家的文化特色
- **关系网络**: 复杂的人际关系系统
- **成就收集**: 丰富的成就系统

## 🔄 版本控制

- 使用Git进行版本控制
- 提交前运行代码格式化
- 遵循团队编码规范
- 及时同步远程分支

---

更多详细信息请参考 [前端技术设计文档](../prdtd/前端技术设计文档_Frontend_TD.md)
