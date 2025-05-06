# 项目结构说明

## 目录结构

```
zippy-wechat/
├── dist/                 # 构建输出目录
├── src/                  # 源代码
│   ├── index.ts          # 主入口文件
│   ├── http/             # HTTP请求封装模块
│   │   └── index.ts      # HTTP类实现
│   ├── official-account/ # 微信公众号相关功能
│   │   ├── base.api.ts   # 基础API实现
│   │   ├── base.http.ts  # 公众号API的HTTP基类
│   │   ├── customer.ts   # 客服消息相关功能
│   │   ├── index.ts      # 公众号模块导出
│   │   ├── material.ts   # 素材管理相关功能
│   │   ├── menu.ts       # 自定义菜单相关功能
│   │   ├── tool.ts       # 工具函数集合
│   │   └── type.ts       # 类型定义
│   └── wx-pay/           # 微信支付相关功能
│       ├── index.ts      # 微信支付模块导出
│       ├── pay.ts        # 微信支付主要功能实现
│       └── type.ts       # 微信支付相关类型定义
├── test/                 # 测试文件目录
├── package.json          # 项目配置文件
├── rollup.config.js      # Rollup构建配置
├── tsconfig.json         # TypeScript配置
├── CHANGELOG.md          # 版本变更记录
├── README.md             # 项目说明文档
└── .github/              # GitHub配置文件
    └── workflows/        # GitHub Actions工作流
        └── npm-publish.yml  # NPM自动发布工作流
```

## 模块说明

### 1. 公众号模块 (official-account)

公众号模块包含了与微信公众号相关的全部功能：

- **base.api.ts**: 实现基础 API，如获取 access_token、quota 管理、JSAPI ticket 等
- **base.http.ts**: 公众号 HTTP 请求基础类，处理公众号 API 的通用请求逻辑
- **customer.ts**: 客服消息相关功能，包括发送客服消息、客服账号管理等
- **material.ts**: 素材管理功能，包括上传/下载临时素材和永久素材
- **menu.ts**: 自定义菜单管理，包括创建、查询和删除菜单
- **tool.ts**: 工具函数，包括消息加解密、XML 转换等
- **type.ts**: 公众号相关的类型定义

### 2. 微信支付模块 (wx-pay)

微信支付模块实现了微信支付 V3 版本的 API：

- **pay.ts**: 主要实现了 WxPay 类，包含所有支付相关功能
- **type.ts**: 微信支付相关的类型定义

### 3. HTTP 模块 (http)

提供了对 HTTP 请求的封装，支持自定义前置处理器，用于与微信 API 交互：

- **index.ts**: 实现 Http 类，封装了 GET、POST、PUT、DELETE 等方法

## 构建系统

项目使用 Rollup 作为构建工具，支持:

- 生成 CommonJS 格式输出 (.js)
- 生成 ES Module 格式输出 (.mjs)
- TypeScript 类型定义 (.d.ts)
- 按需引入的目录结构保留

## 自动化流程

通过 GitHub Actions 实现自动化发布流程:

1. 创建新的版本标签 (v\*)
2. 自动触发构建流程
3. 发布到 NPM

## 版本管理

提供了三个快捷命令用于版本管理:

- `npm run version:patch`: 补丁版本更新 (1.0.0 -> 1.0.1)
- `npm run version:minor`: 次要版本更新 (1.0.0 -> 1.1.0)
- `npm run version:major`: 主要版本更新 (1.0.0 -> 2.0.0)

每个命令会自动更新版本号、提交更改并推送带有标签的版本到 GitHub，触发自动发布流程。
