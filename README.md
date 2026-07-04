# GoodPM - Good Project Manager

多人项目管理应用，支持实时权限管理、任务分配和团队协作。

## 技术栈

- **前端**: React 18 + TypeScript + TanStack Query + Zustand + Socket.io
- **后端**: Node.js + Express + Prisma + PostgreSQL + Redis
- **实时**: Socket.io WebSocket
- **部署**: Docker Compose (本地开发)

## 项目结构

```
GoodPM/
├── backend/                 # Node.js + Express 后端
│   ├── src/
│   │   ├── middleware/     # 权限、认证中间件
│   │   ├── services/       # 业务逻辑层
│   │   ├── events/         # 事件处理
│   │   ├── realtime/       # WebSocket 实时模块
│   │   ├── routes/         # API 路由
│   │   └── utils/          # 工具函数
│   ├── prisma/             # 数据模型定义
│   └── package.json
├── frontend/                # React SPA 前端
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/          # 页面
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── services/       # API 调用
│   │   ├── store/          # 状态管理 (Zustand)
│   │   └── utils/          # 工具函数
│   └── package.json
├── docker-compose.yml      # 本地开发环境
├── ARCHITECTURE.md         # 架构设计文档
└── README.md              # 项目说明
```

## 快速开始

### 前置要求
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (或用 Docker)
- Redis 7+ (或用 Docker)

### 本地开发环境搭建

1. **启动数据库和 Redis**
```bash
docker-compose up -d
```

2. **后端设置**
```bash
cd backend

# 复制环境配置
cp .env.example .env

# 安装依赖
npm install

# 初始化数据库
npm run prisma:migrate

# 启动开发服务器
npm run dev
```

3. **前端设置**
```bash
cd frontend

# 复制环境配置
cp .env.example .env

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

后端运行在 `http://localhost:3000`
前端运行在 `http://localhost:5173`

### 常用命令

**后端**
```bash
npm run dev              # 启动开发服务器
npm run build           # 编译 TypeScript
npm run start           # 生产运行
npm run prisma:migrate  # 运行数据库迁移
npm run prisma:studio   # 打开 Prisma Studio (可视化数据库)
```

**前端**
```bash
npm run dev             # 启动开发服务器
npm run build          # 构建生产版本
npm run preview        # 预览构建后的版本
npm run type-check     # TypeScript 类型检查
```

## 开发流程

1. 创建特性分支: `git checkout -b feature/your-feature`
2. 做出更改并提交: `git commit -m "描述改动"`
3. 推送到 GitHub: `git push origin feature/your-feature`
4. 创建 Pull Request

提交后会自动推送到 GitHub。

## MVP 阶段规划

### 第 1 周 - 基础架构
- [ ] 用户认证（注册/登录，JWT）
- [ ] 项目 CRUD
- [ ] 项目成员管理

### 第 2 周 - 任务管理
- [ ] 任务 CRUD
- [ ] 任务分配
- [ ] 任务状态流转
- [ ] 基础权限检查

### 第 3 周 - 实时功能
- [ ] WebSocket 连接
- [ ] 实时权限推送
- [ ] 在线状态
- [ ] 任务更新通知

### 第 4 周 - 核心看板
- [ ] 项目卡片视图
- [ ] 数据看板
- [ ] 时间线视图
- [ ] 活动日志

## 文件树生成

生成完整的项目结构树：
```bash
# 安装 tree (如果没有)
# macOS: brew install tree
# Ubuntu: sudo apt-get install tree
# Windows: choco install tree

tree -L 3 -I 'node_modules'
```

## 架构设计

详见 [ARCHITECTURE.md](./ARCHITECTURE.md) - 完整的系统设计、数据模型和实现思路。

## 支持

遇到问题？查看 [Issues](https://github.com/DrXLittle/GoodProjectManager/issues)

## License

MIT