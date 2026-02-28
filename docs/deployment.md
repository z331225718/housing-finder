# Cloudflare Pages + Workers 部署配置

## 1. 前端部署 (Cloudflare Pages)

### 方式一：通过 GitHub 自动部署

1. **推送代码到 GitHub**
```bash
cd housing_finder
git init
git add .
git commit -m "Initial commit"
# 创建 GitHub 仓库后
git remote add origin https://github.com/yourusername/housing-finder.git
git push -u origin main
```

2. **连接 Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 Pages → Create a project
   - 选择 GitHub repository
   - 配置：
     - Production branch: `main`
     - Build command: `npm run build`
     - Build output directory: `dist`

### 方式二：手动部署

```bash
# 安装 Cloudflare Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署前端
cd frontend
wrangler pages project create housing-finder
wrangler pages deploy dist
```

---

## 2. 后端部署 (Cloudflare Workers)

### 创建 Workers 项目

```bash
# 初始化 Workers
wrangler init api --ts
cd api
```

### wrangler.toml 配置

```toml
name = "housing-finder-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }
```

### 部署命令

```bash
wrangler deploy
```

---

## 3. 数据库说明

### SQLite 部署注意

SQLite 需要持久化存储。可以选择：

**方案 A: Cloudflare D1 (推荐)**
- 免费额度: 5GB
- 需要将 SQLAlchemy 适配为 D1

**方案 B: 第三方 SQLite 托管**
- Turso (libSQL): 免费 25GB
- Railway: 免费 1GB

**方案 C: 本地存储**
- 文件存储在 Workers KV
- 需要单独处理

### 推荐：使用 D1

1. 创建 D1 数据库
```bash
wrangler d1 create housing-db
```

2. 在 wrangler.toml 中绑定
```toml
[[d1_databases]]
binding = "DB"
database_name = "housing-db"
database_id = "your-database-id"
```

3. 初始化表结构
```bash
wrangler d1 execute housing-db --local --file=./schema.sql
```

---

## 4. 环境变量

在 Cloudflare Dashboard → Workers → Settings → Variables 中设置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| JWT_SECRET | JWT 密钥 | (生成随机字符串) |
| DATABASE_URL | 数据库连接 | (D1 绑定自动提供) |

---

## 5. 快速开始脚本

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Deploying to Cloudflare Pages..."
cd ..
wrangler pages project create housing-finder --production-branch main
wrangler pages deploy frontend/dist --project-name housing-finder

echo "Deploying API..."
cd api
wrangler deploy

echo "Done!"
echo "Frontend: https://housing-finder.pages.dev"
echo "API: https://housing-finder-api.yourname.workers.dev"
```

---

## 6. 本地开发

```bash
# 后端
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 前端
cd frontend
npm install
npm run dev
```

---

**注意**: 当前配置为开发版本，如需生产环境使用，建议：
1. 配置自定义域名
2. 启用 Cloudflare Access
3. 配置 HTTPS 强制
