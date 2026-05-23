# DataLens 项目记忆

## 项目关键信息
- **框架**: Next.js 16.2.6 (Turbopack) + React 19
- **数据库**: Prisma 6.19.3 + Neon PostgreSQL
- **认证**: NextAuth v5 (proxy.ts 中间件)
- **UI**: Tailwind CSS 4 + 自定义组件库
- **部署**: EdgeOne Pages（128MB 限制，已验证不兼容 Prisma）
- **本地运行**: `npm run dev` → http://localhost:3000

## 重要规则
1. **编译通过 ≠ 功能正常**：必须验证实际运行效果，不是只看有无编译错误
2. **先读项目配置再改**：中间件(proxy.ts)、布局文件、认证流程要先理解
3. **客户端导航不触发中间件**：router.push() 纯客户端跳转，proxy.ts 不执行；需要完整页面跳转用 `<a href>` 或 window.location.href
4. **静态页面认证**：页面改为静态后，认证保护依赖 proxy.ts 中间件，不在页面里重复做
5. **不要乱加 AuthGuard 等冗余组件**：proxy.ts 已经处理 /dashboard/* 的登录跳转

## 已修复的问题
- /api/reports GET 支持公开浏览（未登录返回 public 内容）
- FeatureCards 用原生 <a> 标签，不走 react-router 客户端跳转
- 删除了导致页面卡死的 AuthGuard 组件
- /api/users/[id] 和 [username] 路由冲突合并
- 登录/注册页添加 Suspense 包裹
- proxy.ts 公开 API 路径匹配修复

## 页面结构
- 48个静态页面（构建输出）
- SSR 路由：API 路由 + /reports/[id] + /users/[username]
- 中间件保护：/dashboard/* /admin/* /api/*
