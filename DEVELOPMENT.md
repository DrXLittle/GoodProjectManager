# GoodPM 开发指南

## 项目信息

**项目名**: GoodProjectManager (GoodPM)
**GitHub**: https://github.com/DrXLittle/GoodProjectManager
**技术栈**: React 18 + Node.js + Express + PostgreSQL + Redis

## 快速命令

### 启动本地环境
```bash
# 启动 PostgreSQL 和 Redis
docker-compose up -d

# 后端
cd backend && npm install && npm run prisma:migrate && npm run dev

# 前端 (新终端)
cd frontend && npm install && npm run dev
```

### Git 流程
```bash
# 提交后自动推送到 GitHub
git add .
git commit -m "description"
git push
```

## 目录说明

### 后端 (`backend/`)
- `src/middleware/` - 权限检查、认证中间件
- `src/services/` - 业务逻辑（权限管理、项目、任务）
- `src/routes/` - API 路由
- `src/realtime/` - WebSocket 实时处理
- `prisma/schema.prisma` - 数据库模型

### 前端 (`frontend/`)
- `src/components/` - React 组件
- `src/pages/` - 页面组件
- `src/hooks/usePermissions.ts` - 权限同步 Hook
- `src/services/` - API 调用服务
- `src/store/` - Zustand 状态管理

## MVP 开发阶段

### Phase 1: 基础架构 (Week 1)
**目标**: 用户认证、项目管理、成员管理

关键文件:
- `backend/src/routes/auth.ts` - 认证路由
- `backend/src/routes/projects.ts` - 项目路由
- `backend/src/services/permission.service.ts` - 权限逻辑

### Phase 2: 任务管理 (Week 2)
**目标**: 任务 CRUD、分配、权限检查

关键文件:
- `backend/src/routes/tasks.ts` - 任务路由
- `backend/src/middleware/permission.ts` - 权限中间件

### Phase 3: 实时功能 (Week 3)
**目标**: WebSocket、权限推送、在线状态

关键文件:
- `backend/src/realtime/socket.ts` - WebSocket 设置
- `frontend/src/hooks/usePermissions.ts` - 前端权限同步

### Phase 4: 看板 (Week 4)
**目标**: UI 组件、数据展示、活动日志

关键文件:
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/TaskBoard.tsx`

## 代码规范

### 命名约定
- 文件: `kebab-case` (service.ts, permission.middleware.ts)
- 类/接口: `PascalCase` (UserService, PermissionMiddleware)
- 函数/变量: `camelCase` (getUser, userId)

### TypeScript
- 使用严格模式 (`strict: true`)
- 为所有函数参数和返回值标注类型
- 避免 `any` 类型

### 提交信息
```
[type]: description

Types: feat, fix, refactor, docs, chore, test
Example: feat: add real-time permission updates
```

## 常见问题

**Q: 如何连接数据库？**
A: 使用 Prisma ORM，配置见 `backend/prisma/schema.prisma`

**Q: 如何测试权限系统？**
A: 查看 `backend/src/middleware/permission.ts` 的实现和测试

**Q: 前后端如何通信？**
A: 后端提供 REST API + WebSocket，前端用 TanStack Query + Socket.io-client

## 相关文档
- 架构设计: [ARCHITECTURE.md](./ARCHITECTURE.md)
- GitHub: https://github.com/DrXLittle/GoodProjectManager
