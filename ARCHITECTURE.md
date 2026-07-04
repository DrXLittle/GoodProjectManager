# 项目管理应用架构设计方案

## Context

需要构建一个多人项目管理应用，核心需求包括：
- 任务管理、时间线、项目卡片、团队写作、数据看板
- 项目负责人能将任务分配给项目成员
- 实时权限管理（权限变化立即生效）
- 初期用户数 <20 人
- 需要实时功能支持

这个方案优先考虑**快速迭代**和**权限管理的实时性**，避免过度工程。

---

## 推荐技术栈

### 前端
- **React 18** + TypeScript - 组件化、类型安全
- **TanStack Query** - 数据同步和缓存管理
- **Zustand** - 轻量级状态管理
- **Socket.io-client** - 实时通信
- **shadcn/ui** + **Tailwind** - 快速 UI 迭代

### 后端
- **Node.js** + **Express/Fastify** - 简洁高效
- **TypeScript** - 全栈类型统一
- **Socket.io** - 实时双向通信
- **Prisma** - ORM，快速数据模型迭代

### 数据存储
- **PostgreSQL** - 关系型数据库，权限管理结构清晰
- **Redis** - 权限缓存、会话管理、在线状态

### 部署
- **Docker Compose** - 本地开发一致性
- **Render/Railway/Vercel** - 快速云部署

---

## 核心架构

```
前端应用 (React SPA)
  ├─ Dashboard
  ├─ Projects
  ├─ Tasks
  ├─ Timeline
  └─ Team Writing
         ↓ HTTP + WebSocket
后端服务 (Express + Socket.io)
  ├─ Auth Service
  ├─ Project Service
  ├─ Task Service
  ├─ Permission Service
  └─ Real-time Bus
         ↓
数据层
  ├─ PostgreSQL (Projects, Tasks, Users, Permissions, ActivityLog)
  └─ Redis (权限缓存, 会话, 在线状态)
```

### 核心模块
1. **API 模块** - REST 端点：项目、任务、用户、权限 CRUD
2. **实时模块** - WebSocket：权限推送、实时编辑、在线状态
3. **权限引擎** - 中间件级权限检查
4. **业务逻辑层** - 与 Prisma ORM 交互
5. **事件总线** - 权限变更触发实时推送

---

## 数据模型

### 关键表结构

**Users** - 用户
- id (PK), email (UNIQUE), name, avatar, created_at

**Projects** - 项目
- id (PK), name, owner_id (FK), description, created_at

**Tasks** - 任务
- id (PK), project_id (FK), title, description, assigned_to_id (FK), status, priority, due_date, created_at

**ProjectMembers** - 项目成员（支持软删除）
- id (PK), project_id (FK), user_id (FK), role (OWNER/EDITOR/VIEWER), added_at

**Permissions** - 权限缓存表
- id (PK), user_id (FK), project_id (FK), resource_type, action, expires_at, cached_at

**ActivityLog** - 审计日志
- id (PK), user_id (FK), project_id (FK), action, resource_type, details (JSON), timestamp

---

## 实时权限管理实现

### 关键原则
权限变化**秒级生效**，不依赖页面刷新。

### 流程
1. **权限变更 API** - 项目负责人修改权限
2. **数据库更新** - 更新 PostgreSQL (ProjectMembers)
3. **缓存清除** - 清除 Redis 权限缓存
4. **事件发布** - 发布权限变更事件
5. **WebSocket 广播** - 推送给受影响用户
6. **前端响应** - 更新 UI（隐藏/显示按钮，刷新资源列表）

### 实现细节

**后端权限中间件**
- 先从 Redis 检查权限（TTL 5 分钟）
- 缓存未命中时查询 PostgreSQL
- 权限变更时立即清除缓存

**WebSocket 权限推送**
- 连接时识别用户 ID 和项目 ID
- 权限变更时广播到该项目所有连接用户
- 前端收到事件后刷新权限上下文

**前端权限守卫**
- 基于本地权限状态禁用/隐藏操作按钮
- 后端返回 403 时强制重新验证权限

---

## MVP 功能规划（4周交付）

### 第 1 周 - 基础架构
- 用户认证（本地注册/登录，JWT）
- 项目 CRUD（仅项目负责人可编辑）
- 项目成员管理（添加/移除成员）

### 第 2 周 - 任务管理
- 任务 CRUD（项目成员可见）
- 任务分配（项目负责人分配给成员）
- 任务状态流转（待办 → 进行中 → 完成）
- 基于角色的权限检查

### 第 3 周 - 实时功能
- WebSocket 连接建立
- 实时权限推送
- 实时在线状态
- 任务更新实时通知

### 第 4 周 - 核心看板
- 项目卡片列表视图
- 简单数据看板（任务统计、进度条）
- 时间线视图（甘特图简化版）
- 活动日志

### 后续 v1.1（延期功能）
- 团队写作（TipTap 富文本 + Yjs 实时编辑）
- 高级权限（细粒度操作权限）
- 文件附件管理
- 邮件通知

---

## 核心代码框架

### 后端权限中间件 (`/backend/src/middleware/permission.ts`)
```typescript
async function checkProjectPermission(req, res, next) {
  const { projectId } = req.params;
  const userId = req.user.id;
  
  // 检查 Redis 缓存
  let perms = await redis.get(`permissions:${userId}:${projectId}`);
  
  // 缓存未命中，查询数据库
  if (!perms) {
    const member = await ProjectMembers.findOne({ userId, projectId });
    perms = member?.role || 'NONE';
    await redis.setex(`permissions:${userId}:${projectId}`, 300, perms);
  }
  
  // 检查权限
  if (!['OWNER', 'EDITOR'].includes(perms)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  next();
}
```

### 权限业务逻辑 (`/backend/src/services/permission.service.ts`)
- `checkPermission(userId, projectId, action)`
- `revokePermission(userId, projectId)`
- `grantPermission(userId, projectId, role)`
- `invalidatePermissionCache(userId, projectId)`

### 权限事件处理 (`/backend/src/events/permission.events.ts`)
- 监听权限变更事件
- 发布 WebSocket 消息给受影响用户

### WebSocket 实时模块 (`/backend/src/realtime/socket.ts`)
```typescript
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  
  // 加入项目房间
  socket.join(`project:${projectId}`);
  
  // 权限变更事件处理
  emitter.on('permission_revoked', ({ userId: affectedId, projectId }) => {
    io.to(`project:${projectId}`).emit('permissions_changed', {
      affectedUserId: affectedId,
      timestamp: Date.now()
    });
  });
});
```

### 前端权限同步 Hook (`/frontend/src/hooks/usePermissions.ts`)
```typescript
export function usePermissions(projectId) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    socket.on('permissions_changed', ({ affectedUserId }) => {
      if (affectedUserId === currentUserId) {
        // 重新获取权限
        queryClient.invalidateQueries(['permissions', projectId]);
        // 刷新任务列表
        queryClient.invalidateQueries(['tasks', projectId]);
      }
    });
    
    return () => socket.off('permissions_changed');
  }, [projectId]);
}
```

### 数据模型 (`/backend/schema.prisma`)
- 定义 Users, Projects, Tasks, ProjectMembers, Permissions, ActivityLog 表
- 建立关系和约束

---

## 验证方案

### 后端验证
1. 单元测试权限检查逻辑（权限中间件）
2. 集成测试权限变更流程（DB → Cache → Event → WebSocket）
3. 测试场景：
   - 权限变更后缓存立即清除
   - WebSocket 正确广播到受影响用户
   - 无权限用户收到 403 响应

### 前端验证
1. 集成测试权限 UI 响应
2. 测试场景：
   - 权限变更后按钮禁用/隐藏
   - 接收到权限变更事件后刷新列表
   - 操作被拒绝时显示错误提示

### 端到端验证
1. 完整流程：项目负责人撤销成员权限 → WebSocket 推送 → 前端 UI 更新
2. 验证权限秒级生效

---

## 快速迭代建议

- 使用 Prisma migrate 快速迭代数据模型
- API 用 OpenAPI/Swagger 文档化，支持前后端并行开发
- Docker Compose 本地完整开发环境
- 开发分支自动部署到 Staging，PR 合并到 main 后自动部署生产

---

## 关键文件清单

实现时优先关注这些核心文件：

| 文件 | 职责 |
|------|------|
| `/backend/schema.prisma` | 数据模型定义 |
| `/backend/src/middleware/permission.ts` | 权限检查中间件 |
| `/backend/src/services/permission.service.ts` | 权限业务逻辑 |
| `/backend/src/events/permission.events.ts` | 权限变更事件 |
| `/backend/src/realtime/socket.ts` | WebSocket 管理 |
| `/frontend/src/hooks/usePermissions.ts` | 前端权限同步 |
| `/backend/src/routes/projects.ts` | 项目 API 路由 |
| `/backend/src/routes/tasks.ts` | 任务 API 路由 |
