# 上海房源管理系统 (Housing Finder)

一个基于 FastAPI + React 的房源管理系统，用于管理上海地区的房源信息，支持实地看房记录、照片视频上传、Excel 导入导出。

## 技术栈

- **后端**: Python FastAPI + SQLAlchemy + SQLite
- **前端**: React + Vite + TypeScript + TailwindCSS
- **存储**: 本地文件存储 / Cloudflare R2
- **部署**: Cloudflare Pages + Workers (免费额度)

## 功能特性

### 核心功能
- **小区管理**: 记录小区信息（对口学区、环境打分、物业费、周边配套等）
- **房源管理**: 记录房源信息（价格、租售比、户型、面积等）
- **文件上传**: 支持照片和视频上传，自动生成缩略图
- **筛选查询**: 按区、户型、价格区间、租售比等多维度筛选
- **统计仪表盘**: 房源总数、小区总数、平均价格等统计

### Excel 导入
- 下载看房信息模板（小区/房源）
- 批量导入 Excel 数据
- 支持错误提示和部分导入

### 角色权限
- **管理员**: 完整读写权限
- **查看者**: 只读权限（家人使用）

## 项目结构

```
housing_finder/
├── backend/                    # 后端 API
│   ├── app/
│   │   ├── main.py            # 应用入口
│   │   ├── models.py          # 数据模型
│   │   ├── schemas.py         # Pydantic 模型
│   │   ├── crud.py            # 数据库操作
│   │   ├── auth.py            # 认证授权
│   │   ├── database.py        # 数据库配置
│   │   └── routers/           # API 路由
│   │       ├── auth.py         # 登录认证
│   │       ├── communities.py  # 小区管理
│   │       ├── properties.py   # 房源管理
│   │       ├── upload.py       # 文件上传
│   │       ├── stats.py       # 统计数据
│   │       └── import_export.py # Excel 导入导出
│   └── requirements.txt
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── api/               # API 客户端
│   │   ├── components/        # 公共组件
│   │   │   ├── Layout.tsx     # 布局组件
│   │   │   ├── FileUploader.tsx
│   │   │   ├── MediaGallery.tsx
│   │   │   └── ImportModal.tsx
│   │   ├── pages/             # 页面组件
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Communities.tsx
│   │   │   ├── CommunityForm.tsx
│   │   │   ├── Properties.tsx
│   │   │   └── PropertyForm.tsx
│   │   └── types/             # TypeScript 类型
│   └── package.json
├── docs/                      # 文档
│   └── plans/                 # 设计文档
└── README.md
```

## 快速开始

### 后端

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8080
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 访问

- 后端: http://127.0.0.1:8080
- 前端: http://localhost:5173 (或 5174)
- API 文档: http://127.0.0.1:8080/docs

## 使用流程

### 1. 实地看房
1. 下载 Excel 模板（小区/房源）
2. 拿着模板实地看房记录信息

### 2. 数据导入
1. 打开前端页面
2. 点击「导入Excel」上传填好的模板
3. 照片和视频手动上传

### 3. 查看分享
1. 家人注册查看者账号
2. 登录后只读访问房源信息

## API 接口

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 登录 |

### 小区
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/communities | 小区列表 |
| GET | /api/communities/{id} | 小区详情 |
| POST | /api/communities | 新增小区 |
| PUT | /api/communities/{id} | 更新小区 |
| DELETE | /api/communities/{id} | 删除小区 |

### 房源
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/properties | 房源列表 |
| GET | /api/properties/{id} | 房源详情 |
| POST | /api/properties | 新增房源 |
| PUT | /api/properties/{id} | 更新房源 |
| DELETE | /api/properties/{id} | 删除房源 |

### 文件
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload/photo | 上传照片 |
| POST | /api/upload/video | 上传视频 |

### 导入导出
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/import-export/template/community | 下载小区模板 |
| GET | /api/import-export/template/property | 下载房源模板 |
| POST | /api/import-export/community | 导入小区 |
| POST | /api/import-export/property | 导入房源 |

## 开发计划

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 1 | 项目初始化 + 数据库模型 | ✅ 完成 |
| Phase 2 | 后端 API 开发 | ✅ 完成 |
| Phase 3 | 前端界面开发 | ✅ 完成 |
| Phase 4 | 文件上传功能 | ✅ 完成 |
| Phase 5 | Excel 导入功能 | ✅ 完成 |
| Phase 6 | 部署上线 | 待定 |

## 部署配置

### Cloudflare 免费额度

| 服务 | 免费额度 |
|------|---------|
| Pages | 500 分钟/月 |
| Workers | 10万次/天 |
| R2 | 10GB 存储/月 |

### 环境变量

```env
# 后端配置
DATABASE_URL=sqlite:///./housing.db
JWT_SECRET=your-secret-key
R2_ACCESS_KEY=xxx
R2_SECRET_KEY=xxx
R2_BUCKET_NAME=housing-files
R2_PUBLIC_URL=https://xxx.r2.cloudflarestorage.com
```

## 后续迭代（可选）

- [ ] 导出功能（Excel/PDF）
- [ ] 地图展示房源位置
- [ ] 价格趋势图表
- [ ] 房源对比功能
- [ ] 移动端 PWA 支持
- [ ] 消息推送（价格变动提醒）
