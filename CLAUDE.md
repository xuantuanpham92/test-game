# 项目工作规则

## 分支策略

| 分支 | 用途 | 部署权限 |
|------|------|----------|
| `main` | 稳定版，线上 [myfuyao.top](https://myfuyao.top) | 仅用户明确指令时可部署 |
| `dev` | 开发测试，随便改 | 仅用户明确指令时可部署 |

## 部署禁令

- 🚫 **绝不**在用户没有明确说"部署"或"上线"时执行 `vercel --prod`
- 🚫 预览部署 (`vercel` 不加 `--prod`) 也需要先确认
- ✅ 本地 `npm run dev` / `npm run build` 随便用

## 数据库

- 数据库是 Neon PostgreSQL，本地和线上共用
- `npx prisma db seed` 会清空用户数据，执行前需确认
- `npx prisma db push` 会改表结构，执行前需确认
