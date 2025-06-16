# 《重启人生》Web前端技术设计文档

## 文档信息

- **项目名称**: 《重启人生》Web前端
- **文档版本**: v1.0
- **创建日期**: 2024年6月
- **技术栈**: React 18 + TypeScript + Vite
- **目标平台**: 现代Web浏览器

## 1. 系统架构概览

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    《重启人生》Web前端                        │
├─────────────────────────────────────────────────────────────┤
│  用户界面层 (Presentation Layer)                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   首页组件   │ │   游戏组件   │ │   设置组件   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  业务逻辑层 (Business Logic Layer)                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  状态管理    │ │  游戏逻辑    │ │  工具函数    │            │
│  │  (Zustand)  │ │   处理器     │ │   模块      │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  数据访问层 (Data Access Layer)                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  API客户端   │ │  本地存储    │ │  缓存管理    │            │
│  │  (Axios)    │ │ (LocalStorage)│ │   模块      │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │    后端API服务      │
                    │  (Go + PostgreSQL)  │
                    └─────────────────────┘
```

### 1.2 技术选型理由

| 技术 | 选择理由 |
|------|----------|
| **React 18** | 成熟的生态系统，优秀的开发体验，强大的社区支持 |
| **TypeScript** | 类型安全，减少运行时错误，提升开发效率 |
| **Vite** | 极快的开发服务器，优化的生产构建，现代化工具链 |
| **Tailwind CSS** | 原子化CSS，快速开发，优秀的响应式支持 |
| **Zustand** | 轻量级状态管理，简单易用，无样板代码 |
| **React Router** | 官方路由解决方案，功能完善 |

## 2. 项目结构设计

### 2.1 目录结构

```
restart-life-web/
├── public/                     # 静态资源
│   ├── vite.svg
│   └── favicon.ico
├── src/                        # 源代码
│   ├── components/             # 可复用组件
│   │   ├── ui/                # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── game/              # 游戏相关组件
│   │   │   ├── CharacterCard.tsx
│   │   │   ├── LifeStage.tsx
│   │   │   ├── AttributeBar.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── index.ts
│   │   ├── common/            # 通用组件
│   │   │   ├── Layout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pages/                 # 页面组件
│   │   ├── Home.tsx          # 首页
│   │   ├── Game.tsx          # 游戏主页面
│   │   ├── Character/        # 角色相关页面
│   │   │   ├── Create.tsx    # 创建角色
│   │   │   ├── Detail.tsx    # 角色详情
│   │   │   └── List.tsx      # 角色列表
│   │   ├── About.tsx         # 关于页面
│   │   └── index.ts
│   ├── hooks/                # 自定义Hooks
│   │   ├── useCharacter.ts   # 角色相关Hook
│   │   ├── useGame.ts        # 游戏逻辑Hook
│   │   ├── useAPI.ts         # API请求Hook
│   │   └── index.ts
│   ├── store/                # 状态管理
│   │   ├── gameStore.ts      # 游戏状态
│   │   ├── userStore.ts      # 用户状态
│   │   ├── settingsStore.ts  # 设置状态
│   │   └── index.ts
│   ├── api/                  # API接口层
│   │   ├── client.ts         # API客户端配置
│   │   ├── auth.ts           # 认证接口
│   │   ├── character.ts      # 角色接口
│   │   ├── game.ts           # 游戏接口
│   │   └── index.ts
│   ├── types/                # TypeScript类型定义
│   │   ├── api.ts            # API响应类型
│   │   ├── game.ts           # 游戏数据类型
│   │   ├── user.ts           # 用户数据类型
│   │   └── index.ts
│   ├── utils/                # 工具函数
│   │   ├── format.ts         # 格式化工具
│   │   ├── storage.ts        # 存储工具
│   │   ├── validation.ts     # 验证工具
│   │   ├── constants.ts      # 常量定义
│   │   └── index.ts
│   ├── assets/               # 静态资源
│   │   ├── images/           # 图片资源
│   │   ├── icons/            # 图标资源
│   │   └── sounds/           # 音效资源
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── .env.example              # 环境变量示例
├── .gitignore                # Git忽略文件
├── index.html                # HTML模板
├── package.json              # 项目配置
├── tailwind.config.js        # Tailwind配置
├── tsconfig.json             # TypeScript配置
├── tsconfig.node.json        # Node.js TypeScript配置
└── vite.config.ts            # Vite配置
```

### 2.2 模块化设计原则

1. **单一职责**: 每个模块只负责一个功能
2. **高内聚低耦合**: 模块内部紧密相关，模块间依赖最小
3. **可复用性**: 组件和函数设计为可复用
4. **可测试性**: 所有模块都易于单元测试

## 3. 状态管理设计

### 3.1 Zustand状态架构

```typescript
// store/gameStore.ts
interface GameState {
  // 当前角色
  currentCharacter: Character | null
  
  // 游戏状态
  gameMode: 'menu' | 'playing' | 'paused'
  currentYear: number
  
  // 游戏选项
  gameSpeed: 'slow' | 'normal' | 'fast'
  autoSave: boolean
  
  // 历史记录
  lifeHistory: LifeEvent[]
  
  // 方法
  createCharacter: (config: CharacterConfig) => void
  advanceYear: (mode: AdvanceMode) => void
  pauseGame: () => void
  resumeGame: () => void
  saveGame: () => void
  loadGame: (saveData: SaveData) => void
}

// store/userStore.ts
interface UserState {
  // 用户信息
  user: User | null
  isAuthenticated: boolean
  
  // 用户设置
  preferences: UserPreferences
  
  // 方法
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
}
```

### 3.2 状态同步策略

1. **本地优先**: 游戏状态优先保存在本地
2. **增量同步**: 只同步变更的数据到服务器
3. **冲突解决**: 使用时间戳解决同步冲突
4. **离线支持**: 支持离线游戏，联网时自动同步

## 4. 组件设计系统

### 4.1 基础UI组件

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  onClick?: () => void
  children: React.ReactNode
}

// components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}
```

### 4.2 游戏组件

```typescript
// components/game/CharacterCard.tsx
interface CharacterCardProps {
  character: Character
  onSelect?: (character: Character) => void
  onDelete?: (characterId: string) => void
  showActions?: boolean
}

// components/game/AttributeBar.tsx
interface AttributeBarProps {
  label: string
  value: number
  maxValue: number
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  showValue?: boolean
  animated?: boolean
}
```

### 4.3 组件开发规范

1. **函数组件**: 使用React函数组件
2. **TypeScript**: 严格类型定义props和state
3. **默认导出**: 组件使用默认导出
4. **Props接口**: 每个组件定义明确的Props接口
5. **文档注释**: 重要组件添加JSDoc注释

## 5. API接口设计

### 5.1 API客户端配置

```typescript
// api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权，跳转到登录页
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 5.2 API接口层

```typescript
// api/character.ts
export const characterAPI = {
  // 获取角色列表
  getCharacters: (): Promise<Character[]> =>
    apiClient.get('/api/characters').then(res => res.data),

  // 创建角色
  createCharacter: (config: CharacterConfig): Promise<Character> =>
    apiClient.post('/api/characters', config).then(res => res.data),

  // 获取角色详情
  getCharacter: (id: string): Promise<Character> =>
    apiClient.get(`/api/characters/${id}`).then(res => res.data),

  // 推进角色人生
  advanceCharacter: (id: string, mode: AdvanceMode): Promise<LifeEvent> =>
    apiClient.put(`/api/characters/${id}/advance`, { mode }).then(res => res.data),

  // 删除角色
  deleteCharacter: (id: string): Promise<void> =>
    apiClient.delete(`/api/characters/${id}`),
}
```

### 5.3 错误处理策略

1. **统一错误处理**: 在响应拦截器中统一处理
2. **用户友好提示**: 将技术错误转换为用户可理解的消息
3. **重试机制**: 对于网络错误实现自动重试
4. **降级方案**: 网络不可用时的本地模式

## 6. 路由设计

### 6.1 路由结构

```typescript
// App.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'game',
        element: <Game />,
        children: [
          {
            path: 'character/create',
            element: <CreateCharacter />,
          },
          {
            path: 'character/:id',
            element: <CharacterDetail />,
          },
          {
            path: 'character/:id/play',
            element: <PlayGame />,
          },
        ],
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])
```

### 6.2 路由守卫

```typescript
// hooks/useAuthGuard.ts
export const useAuthGuard = () => {
  const { isAuthenticated } = useUserStore()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])
}
```

## 7. 性能优化策略

### 7.1 代码分割

```typescript
// 路由级别的代码分割
const Home = lazy(() => import('@pages/Home'))
const Game = lazy(() => import('@pages/Game'))
const About = lazy(() => import('@pages/About'))

// 组件级别的代码分割
const CharacterDetail = lazy(() => import('@components/game/CharacterDetail'))
```

### 7.2 状态优化

1. **memo化组件**: 使用React.memo防止不必要的重渲染
2. **useMemo优化**: 缓存复杂计算结果
3. **useCallback优化**: 缓存事件处理函数
4. **状态分片**: 将大状态拆分为小状态

### 7.3 资源优化

1. **图片懒加载**: 使用Intersection Observer API
2. **资源压缩**: Vite自动压缩静态资源
3. **CDN加速**: 静态资源使用CDN分发
4. **预加载**: 关键资源预加载

## 8. 测试策略

### 8.1 单元测试

```typescript
// components/__tests__/Button.test.tsx
import { render, fireEvent, screen } from '@testing-library/react'
import { Button } from '../ui/Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button variant="primary" onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 8.2 集成测试

```typescript
// api/__tests__/character.test.ts
import { characterAPI } from '../character'
import { server } from '../../mocks/server'

describe('Character API', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('creates character successfully', async () => {
    const config = { country: 'china', birthYear: 1990 }
    const character = await characterAPI.createCharacter(config)
    expect(character.country).toBe('china')
    expect(character.birthYear).toBe(1990)
  })
})
```

### 8.3 端到端测试

```typescript
// e2e/game-flow.spec.ts
import { test, expect } from '@playwright/test'

test('complete game flow', async ({ page }) => {
  await page.goto('/')
  
  // 点击开始游戏
  await page.click('text=开始新人生')
  
  // 创建角色
  await page.selectOption('select[name="country"]', 'china')
  await page.fill('input[name="birthYear"]', '1990')
  await page.click('text=创建角色')
  
  // 验证游戏开始
  await expect(page.locator('text=您的人生开始了')).toBeVisible()
})
```

## 9. 部署配置

### 9.1 构建配置

```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

### 9.2 Docker配置

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 9.3 环境配置

```bash
# .env.production
VITE_API_BASE_URL=https://api.restart-life.com
VITE_APP_TITLE=《重启人生》
VITE_DEBUG=false
```

## 10. 监控和维护

### 10.1 错误监控

```typescript
// utils/errorReporting.ts
import * as Sentry from '@sentry/react'

export const setupErrorReporting = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
  })
}
```

### 10.2 性能监控

```typescript
// utils/analytics.ts
export const trackPageView = (page: string) => {
  if (import.meta.env.PROD) {
    gtag('config', 'GA_TRACKING_ID', {
      page_title: page,
      page_location: window.location.href,
    })
  }
}

export const trackEvent = (action: string, category: string, label?: string) => {
  if (import.meta.env.PROD) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    })
  }
}
```

### 10.3 日志记录

```typescript
// utils/logger.ts
class Logger {
  info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data)
  }
  
  warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data)
  }
  
  error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}`, error)
    // 在生产环境发送到监控服务
    if (import.meta.env.PROD) {
      Sentry.captureException(error || new Error(message))
    }
  }
}

export const logger = new Logger()
```

## 11. 安全考虑

### 11.1 前端安全

1. **XSS防护**: 使用React的内置XSS防护
2. **CSRF防护**: API请求包含CSRF令牌
3. **内容安全策略**: 配置CSP头部
4. **敏感信息**: 不在前端存储敏感信息

### 11.2 数据验证

```typescript
// utils/validation.ts
import { z } from 'zod'

export const CharacterConfigSchema = z.object({
  country: z.string().min(1, '请选择国家'),
  birthYear: z.number().min(1800).max(2050, '年份必须在1800-2050之间'),
  gender: z.enum(['male', 'female', 'other']).optional(),
})

export const validateCharacterConfig = (data: unknown) => {
  return CharacterConfigSchema.safeParse(data)
}
```

## 12. 开发工具配置

### 12.1 ESLint配置

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
```

### 12.2 Prettier配置

```javascript
// .prettierrc.js
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
}
```

## 13. 版本发布流程

### 13.1 版本管理

1. **语义化版本**: 使用SemVer版本号
2. **Git标签**: 每个版本打标签
3. **变更日志**: 自动生成CHANGELOG
4. **发布分支**: 使用Git Flow模式

### 13.2 CI/CD流程

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to production
      run: echo "Deploy to production server"
```

## 14. 总结

本技术设计文档为《重启人生》Web前端提供了完整的技术方案，包括：

1. **现代化技术栈**: React 18 + TypeScript + Vite
2. **清晰的架构设计**: 分层架构，职责明确
3. **完善的开发规范**: 代码规范、测试策略、部署流程
4. **性能优化**: 代码分割、状态优化、资源优化
5. **可维护性**: 模块化设计、错误监控、日志记录

这个设计确保了项目的可扩展性、可维护性和高性能，为开发团队提供了清晰的技术指导。

---

*文档版本: v1.0 | 最后更新: 2024年6月* 