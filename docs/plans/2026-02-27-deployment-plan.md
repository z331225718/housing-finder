# 部署计划

## 目标
将上海房源管理系统部署到 Cloudflare Pages + Workers，实现免费托管。

## 技术方案

| 服务 | 免费额度 | 用途 |
|------|---------|------|
| Cloudflare Pages | 500分钟/月 | 前端静态网站 |
| Cloudflare Workers | 10万次/天 | 后端 API |
| Cloudflare R2 | 10GB/月 | 文件存储(照片/视频) |

## 实施步骤

### Phase 1: 后端部署 (Workers)
- [ ] 1.1 创建 Cloudflare Workers 项目
- [ ] 1.2 配置 Python Workers 环境 (Python Workers 预览版或使用 FastAPI 兼容层)
- [ ] 1.3 配置 wrangler.toml
- [ ] 1.4 部署后端 API 到 Workers
- [ ] 1.5 测试 API 端点

### Phase 2: 前端部署 (Pages)
- [ ] 2.1 创建 Cloudflare Pages 项目
- [ ] 2.2 配置构建命令 (npm run build)
- [ ] 2.3 配置环境变量 (API 指向 Workers)
- [ ] 2.4 部署前端
- [ ] 2.5 配置自定义域名 (可选)

### Phase 3: 文件存储 (R2)
- [ ] 3.1 创建 R2 存储桶
- [ ] 3.2 配置 R2 API 密钥
- [ ] 3.3 修改后端上传逻辑指向 R2
- [ ] 3.4 配置公共访问域名

### Phase 4: 配置
- [ ] 4.1 设置环境变量
- [ ] 4.2 配置 JWT_SECRET
- [ ] 4.3 首次用户注册/密码设置

## 替代方案 (更简单)

如果 Python Workers 不稳定，可以考虑：
1. **Railway / Render / Fly.io** - 免费 Python 后端托管
2. **Vercel** - 免费前端 + Serverless Functions
3. **Supabase** - 免费 PostgreSQL + Storage

## 待确认
- [ ] Cloudflare 账号是否已创建
- [ ] 是否需要自定义域名
- [ ] 选择后端部署方案 (Workers / 其他)

## 预计工作量
- Cloudflare 方案: 2-3 小时 (需要等待 Python Workers 支持稳定)
- 替代方案: 1-2 小时
