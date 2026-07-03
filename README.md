# 扶摇弱科人格画像测试网站

> 通过测评题、错因选择和学习行为问卷，生成学生的"弱科人格画像"，定位主要失分机制，并输出个性化提升建议。

## 项目介绍

扶摇弱科人格画像是一个面向初高中学生的弱科学习诊断工具。它用 MBTI 的传播形式包装学习诊断，用真实测评数据支撑画像可信度，用个性化训练建议完成商业转化。

### 核心功能

- **弱科人格测评**：24道学习行为问卷 + 场景判断题
- **八维能力画像**：条件识别力、公式唤醒力、题型迁移力、计算稳定性、复盘转化力、表达规范性、压轴拆解力、时间控制力
- **8种弱科人格**：条件漏网型、公式沉睡型、变式迷路型、计算翻车型、复盘失联型、表达掉线型、压轴迷路型、时间黑洞型
- **能力雷达图**：可视化八维能力分数
- **个性化报告**：诊断摘要、七天提升计划、专项训练建议
- **分享传播**：生成分享卡片、保存图片
- **线索转化**：留资领取完整学习计划
- **管理后台**：用户管理、线索管理、题目管理、人格管理、数据看板

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 14 + React 18 |
| 类型系统 | TypeScript |
| 样式方案 | Tailwind CSS |
| 动画 | Framer Motion |
| 图表 | Recharts |
| 图片生成 | html-to-image |
| 表单校验 | Zod |
| 数据库 | SQLite (本地) / PostgreSQL (生产) |
| ORM | Prisma |
| 认证 | jose (JWT) |
| 密码加密 | bcryptjs |

## 本地启动步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 生成 Prisma Client

```bash
npx prisma generate
```

### 3. 数据库迁移

```bash
npx prisma migrate dev --name init
```

### 4. 初始化种子数据

```bash
npx prisma db seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DATABASE_URL` | 数据库连接字符串 | `file:./dev.db` (SQLite) |
| `NEXT_PUBLIC_APP_URL` | 应用URL | `http://localhost:3000` |
| `ADMIN_JWT_SECRET` | 管理员JWT密钥 | `fuyao-dev-secret-change-in-production-2024` |

生产环境请使用 PostgreSQL：
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

## 管理员账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `ChangeMe123!` | 超级管理员 |

> ⚠️ 首次上线后必须修改默认密码！

## 主要页面路由

### 用户端

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 产品介绍和开始测试 |
| 基础信息页 | `/profile` | 填写年级、科目 |
| 测评页 | `/test` | 完成24道测评题 |
| 生成页 | `/generating` | 报告生成动画 |
| 结果页 | `/result/[id]` | 完整人格画像报告 |
| 分享页 | `/share/[id]` | 分享卡片 |
| 领取计划页 | `/claim` | 留资领取学习计划 |

### 管理后台

| 页面 | 路由 | 说明 |
|------|------|------|
| 后台登录 | `/admin/login` | 管理员登录 |
| 数据看板 | `/admin/dashboard` | 核心数据统计 |
| 用户管理 | `/admin/users` | 用户列表和详情 |
| 线索管理 | `/admin/leads` | 销售线索管理 |
| 题目管理 | `/admin/questions` | 题目CRUD |
| 人格管理 | `/admin/personalities` | 人格类型配置 |
| 报告模板 | `/admin/report-templates` | 报告模板（V2） |

## 主要 API

### 用户端 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/users` | 创建用户 |
| GET | `/api/questions` | 获取题目列表（不含评分规则） |
| POST | `/api/test-sessions` | 创建测试会话 |
| POST | `/api/answers` | 提交答案 |
| POST | `/api/reports/generate` | 生成报告 |
| GET | `/api/reports/:id` | 获取报告 |
| POST | `/api/leads` | 提交线索 |

### 管理后台 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/login` | 管理员登录 |
| POST | `/api/admin/logout` | 管理员登出 |
| GET | `/api/admin/dashboard` | 数据看板 |
| GET | `/api/admin/users` | 用户列表 |
| GET | `/api/admin/leads` | 线索列表 |
| PATCH | `/api/admin/leads/:id` | 更新线索 |
| GET/POST | `/api/admin/questions` | 题目列表/创建 |
| PATCH/DELETE | `/api/admin/questions/:id` | 更新/删除题目 |
| GET | `/api/admin/personalities` | 人格列表 |
| PATCH | `/api/admin/personalities/:id` | 更新人格 |

## 部署方式

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 设置环境变量：
   - `DATABASE_URL` - PostgreSQL 连接字符串（可使用 Neon/Supabase）
   - `ADMIN_JWT_SECRET` - 强随机密钥
   - `NEXT_PUBLIC_APP_URL` - 生产域名
4. 部署

### 数据库

推荐使用 Neon 或 Supabase 提供的免费 PostgreSQL 服务。

使用 PostgreSQL 时，修改 `prisma/schema.prisma` 中的 `provider` 为 `"postgresql"`。

## 常见问题

### Q: 为什么本地使用 SQLite？
A: SQLite 无需安装任何数据库服务，克隆即可运行。生产环境建议切换到 PostgreSQL。

### Q: 如何修改题目？
A: 登录后台 → 题目管理，可以新增、编辑、禁用题目。每道题的选项和维度映射都可以配置。

### Q: 评分规则如何工作？
A: 每道题的每个选项都有对应的维度加减分。用户选择后，系统从初始70分开始累加各维度分数，最终最低分维度对应主人格。

### Q: 如何导出线索？
A: 登录后台 → 线索管理，点击"导出CSV"按钮。

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由 (17个)
│   ├── admin/             # 管理后台页面 (8个)
│   ├── profile/           # 基础信息页
│   ├── test/              # 测评页
│   ├── generating/        # 报告生成页
│   ├── result/[id]/       # 结果页
│   ├── share/[id]/        # 分享页
│   └── claim/             # 留资页
├── components/            # React 组件
│   └── common/            # 通用组件 (11个)
├── lib/                   # 核心库 (6个)
│   ├── constants.ts       # 常量定义
│   ├── scoring.ts         # 评分算法
│   ├── report.ts          # 报告生成
│   ├── auth.ts            # 认证工具
│   ├── validators.ts      # Zod校验
│   └── prisma.ts          # Prisma客户端
├── prisma/                # 数据库
│   ├── schema.prisma      # 数据模型
│   └── seed.ts            # 种子数据
└── middleware.ts           # 路由中间件
```

## 许可证

私有项目 - 扶摇品牌
