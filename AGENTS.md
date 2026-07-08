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

```
线上 Vercel   →  DATABASE_URL (Vercel 环境变量)  →  neondb      (生产)
本地 dev 分支  →  DATABASE_URL (.env 文件)         →  neondb_dev  (测试)
```

- 两个数据库完全隔离，互不影响
- `.env` 指向 `neondb_dev`，仅在本地生效
- Vercel 环境变量指向 `neondb`，仅线上生效
- `npx prisma db seed` 现在只影响 dev 数据库，线上不受影响
- `npx prisma db push` 也只影响 dev 数据库
