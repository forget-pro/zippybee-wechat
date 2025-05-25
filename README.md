# Zippy WeChat Kit

一个轻量级的微信公众号和支付开发工具包，提供了丰富的 API 集成功能。

[![NPM Version](https://img.shields.io/npm/v/@zippybee/wechat-kit.svg?logo=npm&logoColor=ea2039)](https://www.npmjs.com/package/@zippybee/wechat-kit) [![GitHub Release](https://img.shields.io/github/v/release/dr-forget/zippy-wechat-kit.svg?logo=github)](https://github.com/dr-forget/zippy-wechat-kit/releases) [![NPM Downloads](https://img.shields.io/npm/dt/@zippybee/wechat-kit?logo=npm&logoColor=ea2039)](https://www.npmjs.com/package/@zippybee/wechat-kit) [![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D%2020.x-brightgreen?logo=node.js)](https://nodejs.org) [![TypeScript Version](https://img.shields.io/badge/TypeScript-%3E%3D%204.0-blue?logo=typescript)](https://www.typescriptlang.org/) [![Rollup](https://img.shields.io/badge/Rollup-%3E%3D%204.x-blue?logo=webpack&logoColor=ea2039)](https://rollupjs.org/) [![Wechat](https://img.shields.io/badge/Wechat-Supported-brightgreen?logo=wechat)](https://www.wechat.com/) [![GitHub Actions](https://img.shields.io/github/actions/workflow/status/dr-forget/zippy-wechat-kit/npm-publish.yml?branch=main&logo=github-actions)](https://github.com/dr-forget/zippy-wechat-kit/actions) [![Repo Size](https://img.shields.io/github/repo-size/dr-forget/zippy-wechat-kit?logo=github)](https://github.com/dr-forget/zippy-wechat-kit) [![Last Commit](https://img.shields.io/github/last-commit/dr-forget/zippy-wechat-kit?logo=github)](https://github.com/dr-forget/zippy-wechat-kit/commits) [![License](https://img.shields.io/badge/License-ISC-blue.svg?logo=open-source-initiative)](https://opensource.org/licenses/ISC) [![Contributors](https://img.shields.io/github/contributors/dr-forget/zippy-wechat-kit?logo=github)](https://github.com/dr-forget/zippy-wechat-kit/graphs/contributors)

## 目录

- [安装](#安装)
- [功能特性](#功能特性)
- [模块组成](#模块组成)
- [使用示例](#使用示例)
  - [公众号功能](#公众号功能)
  - [微信支付功能](#微信支付功能)
- [API 文档](#api-文档)
- [注意事项](#注意事项)
- [开发指南](#开发指南)
- [贡献指南](#贡献指南)
- [贡献者](#贡献者)
- [环境要求](#环境要求)
- [许可证](#许可证)

## 安装

```bash
npm install @zippybee/wechat-kit
# 或
yarn add @zippybee/wechat-kit
```

## 功能特性

- **公众号 API 集成**：支持微信公众号的各种 API，包括授权认证、消息处理、素材管理等
- **微信支付 V3 API**：支持微信支付 V3 的所有支付方式和商户功能
- **消息加解密**：支持微信公众号消息的加密与解密
- **素材管理**：支持上传、下载和管理微信临时素材和永久素材
- **菜单管理**：支持创建和管理微信公众号自定义菜单
- **客服消息**：支持发送各类客服消息
- **工具函数**：提供了一系列实用的微信开发辅助函数

## 模块组成

本项目包含以下主要模块：

- **官方账号模块 (official-account)**：提供公众号相关功能
- **微信支付模块 (wx-pay)**：提供微信支付 V3 版本的 API 封装
- **HTTP 模块**：封装了与微信 API 交互的 HTTP 请求，支持接口调用前的预处理和自定义请求配置

## 使用示例

### 公众号功能

#### 获取 Access Token

```javascript
import { getAccessToken } from '@zippybee/wechat-kit';

// 获取公众号 access_token
const { access_token, expires_in } = await getAccessToken('your-app-id', 'your-app-secret');
console.log(access_token, expires_in);
```

#### 素材上传

```javascript
import { addMaterial } from '@zippybee/wechat-kit';

// 上传临时素材
const result = await addMaterial({
  access_token: 'your-access-token',
  media: '/path/to/image.jpg', // 本地文件路径
  type: 'image',
  isPermanent: false,
});

// 也支持从 URL 上传
const remoteResult = await addMaterial({
  access_token: 'your-access-token',
  media: 'https://example.com/image.jpg', // 远程文件 URL
  type: 'image',
  isPermanent: false,
});
```

#### 自定义菜单

```javascript
import { createMenu } from '@zippybee/wechat-kit';

// 创建自定义菜单
const menu = {
  button: [
    {
      type: 'view',
      name: '官网',
      url: 'https://example.com',
    },
    {
      name: '菜单',
      sub_button: [
        {
          type: 'view',
          name: '搜索',
          url: 'https://example.com/search',
        },
        {
          type: 'click',
          name: '赞一下',
          key: 'V1001_GOOD',
        },
      ],
    },
  ],
};

await createMenu(access_token, menu);
```

#### 消息加解密

```javascript
import { verifyMessage, decryptMessage, encryptMessage } from '@zippybee/wechat-kit';

// 验证消息签名
const signature = await verifyMessage(token, timestamp, nonce, encrypt);

// 解密消息
const decrypted = await decryptMessage(aesKey, token, encrypt);

// 加密消息
const encrypted = await encryptMessage(appid, token, aesKey, xml);
```

#### 发送客服消息

```javascript
import { sendCustomerMessage } from '@zippybee/wechat-kit';

// 发送文本消息
await sendCustomerMessage(access_token, {
  touser: 'user-openid',
  msgtype: 'text',
  text: {
    content: '您好，这是一条客服消息',
  },
});

// 发送图片消息
await sendCustomerMessage(access_token, {
  touser: 'user-openid',
  msgtype: 'image',
  image: {
    media_id: 'media-id-from-upload',
  },
});
```

### 微信支付功能

#### 初始化支付实例

```javascript
import { WxPay } from '@zippybee/wechat-kit';

const wxPay = new WxPay({
  apiClientkey: 'your-api-client-key', // API证书私钥
  mch_id: 'your-merchant-id', // 商户号
  appid: 'your-app-id', // 小程序或公众号appid
  serial_no: 'your-serial-number', // API证书序列号
});
```

#### JSAPI/小程序支付

```javascript
// 小程序支付统一下单
const result = await wxPay.unifiedOrder({
  description: '商品描述',
  out_trade_no: '商户订单号',
  notify_url: 'https://example.com/notify',
  amount: {
    total: 100, // 单位：分
  },
  payer: {
    openid: 'user-openid',
  },
});

// result 包含了调起支付所需的所有参数
console.log(result);
```

#### App 支付

```javascript
// App支付统一下单
const result = await wxPay.unifiedOrderApp({
  description: '商品描述',
  out_trade_no: '商户订单号',
  notify_url: 'https://example.com/notify',
  amount: {
    total: 100, // 单位：分
  },
});

// result 包含了调起App支付所需的所有参数
console.log(result);
```

#### H5 支付

```javascript
// H5支付统一下单
const h5Url = await wxPay.unifiedOrderH5({
  description: '商品描述',
  out_trade_no: '商户订单号',
  notify_url: 'https://example.com/notify',
  amount: {
    total: 100, // 单位：分
  },
  scene_info: {
    payer_client_ip: '用户IP',
  },
});

// 返回支付链接，可直接跳转
console.log(h5Url);
```

#### Native 支付（扫码支付）

```javascript
// Native支付统一下单
const codeUrl = await wxPay.unifiedOrderNative({
  description: '商品描述',
  out_trade_no: '商户订单号',
  notify_url: 'https://example.com/notify',
  amount: {
    total: 100, // 单位：分
  },
});

// 返回二维码链接，可生成二维码供用户扫描
console.log(codeUrl);
```

#### 订单查询

```javascript
// 通过微信支付订单号查询
const orderInfo = await wxPay.queryOrder('4200000000000000000000000000');

// 通过商户订单号查询
const orderByOutTradeNo = await wxPay.queryOrderByOutTradeNo('your-out-trade-no');
```

#### 退款申请

```javascript
// 申请退款
const refundResult = await wxPay.refund({
  out_trade_no: '商户订单号',
  out_refund_no: '商户退款单号',
  amount: {
    refund: 100, // 退款金额，单位分
    total: 100, // 原订单金额，单位分
    currency: 'CNY',
  },
  reason: '退款原因',
});

// 查询退款
const refundInfo = await wxPay.queryRefund('商户退款单号');
```

### HTTP 模块使用

```javascript
import { Http } from '@zippybee/wechat-kit';

// 创建HTTP实例
const http = new Http('https://api.example.com', (config) => {
  // 请求预处理，例如添加通用头部
  config.headers['Authorization'] = 'Bearer your-token';
  return config;
});

// 发起GET请求
const getResult = await http.get('/path', { param1: 'value1' });

// 发起POST请求
const postResult = await http.post('/path', { data: 'value' });
```

## API 文档

### 公众号相关 API

- `getAccessToken(appid, secret)` - 获取公众号 access_token
- `getQuota(access_token, cgi_path)` - 查询 API 配额
- `getRid(access_token, rid)` - 查询消息 ID 信息
- `clearQuota(appid, access_token)` - 清空 API 配额
- `resetQuota(appid, appSecret)` - 重置 API 调用次数
- `getJsapiTicket(access_token)` - 获取 JS API Ticket
- `getJsapiTicketSignature(jsapi_ticket, url)` - 生成 JS API 签名
- `getWebUserInfo(access_token, openid)` - 获取用户信息
- `getQrcode(access_token,QrcodeOptions)` - 新增生成带参数的二维码
- `shortKey(access_token,long_data，expire_seconds)` - 短 key 托管

### 素材管理

- `addMaterial(options)` - 上传素材（支持临时和永久）
- `getTemporaryMaterial(access_token, media_id)` - 获取临时素材
- `getPermanentMaterial(access_token, media_id)` - 获取永久素材
- `deletePermanentMaterial(access_token, media_id)` - 删除永久素材
- `getMaterialCount(access_token)` - 获取素材总数
- `getMaterialList(access_token, type, offset, count)` - 获取素材列表

### 菜单管理

- `createMenu(access_token, menu)` - 创建自定义菜单
- `getMenu(access_token)` - 获取自定义菜单
- `deleteMenu(access_token)` - 删除自定义菜单

### 客服消息

- `addCustomerServiceAccount(access_token, account)` - 添加客服账号
- `deleteCustomerServiceAccount(access_token, account)` - 删除客服账号
- `sendCustomerMessage(access_token, message)` - 发送客服消息
- `getAllCustomerServiceAccount(access_token)` - 获取所有客服账号
- `setCustomerServiceTyping(access_token,openid,commadn)` - 客服输入状态

### 模板消息&订阅消息

#### 订阅消息

- `addTemplate(access_token, tid,kidList,sceneDesc)` - 从公共模板库中选用模板，到私有模板库中
- `delTemplate(access_token, priTmplId)` - 删除模板
- `getCategory(access_token)` - 获取公众号类目
- `getPubTemplateKeyWords(access_token,tid)` - 获取公共模板标题下的关键词列表
- `getPubTemplateTitles(access_token,ids,start,limit)` - 获取类目下的公共模板
- `getPrivatelyTemplateList(access_token)` - 获取私有模板列表
- `sendSubscribeMessage(access_token,SendSubscribeMessageOptions)` - 发送订阅通知
- `getInterceptedTemplateMessage(access_token,tmpl_msg_id,largest_id,limit)` - 查询拦截的模板消息

#### 模板消息

- `setIndustry(accessToken,industryId1,industryId2)` - 设置所属行业
- `getIndustry(accessToken)` - 获取设置的行业信息
- `getTemplateId(accessToken,template_id_short,keyword_name_list)` - 获得模板 ID
- `getTemplateList(accessToken)` - 获取模板列表
- `deleteTemplate(accessToken,templateId)` - 删除模板（模板消息）
- `sendTemplateMessage(accessToken,TemplateMessageOptions)` - 发送模板消息

### 消息加解密

- `verifyMessage(token, timestamp, nonce, encrypt)` - 验证消息签名
- `decryptMessage(aesKey, token, encrypt)` - 解密消息
- `encryptMessage(appid, token, aesKey, xml)` - 加密消息
- `objectToXml(obj)` - 对象转 XML
- `xmlToObject(xml)` - XML 转对象
- `validateXml(xml)` - 验证是否是 xml 字符串

### 微信支付 V3 API

- **基础支付功能**

  - `unifiedOrder(options)` - JSAPI/小程序支付下单
  - `unifiedOrderApp(options)` - App 支付下单
  - `unifiedOrderH5(options)` - H5 支付下单
  - `unifiedOrderNative(options)` - Native 支付下单
  - `queryOrder(transaction_id)` - 微信支付订单号查询订单
  - `queryOrderByOutTradeNo(out_trade_no)` - 商户订单号查询订单
  - `closeOrder(out_trade_no)` - 关闭订单

- **退款功能**

  - `refund(options)` - 申请退款
  - `queryRefund(out_refund_no)` - 查询单笔退款
  - `exceptionRefund(options)` - 发起异常退款

- **合单支付功能**

  - `unifiedOrderAppCombine(options)` - App 合单支付
  - `unifiedOrderH5Combine(options)` - H5 合单支付
  - `unifiedOrderJsapiCombine(options)` - JSAPI/小程序合单支付
  - `unifiedOrderNativeCombine(options)` - Native 合单支付
  - `queryCombineOrder(combine_out_trade_no)` - 查询合单订单
  - `closeCombineOrder(options)` - 关闭合单订单
  - `refundCombineOrder(options)` - 合单退款
  - `queryCombineRefund(out_refund_no)` - 查询合单退款
  - `exceptionCombineRefund(options)` - 合单异常退款

- **账单相关**

  - `applyTradeBill(bill_date, bill_type, tar_type)` - 申请交易账单
  - `applyFundBill(bill_date, bill_type, tar_type)` - 申请资金账单
  - `downloadBill(url)` - 下载账单

### 用户模块

- `createUserTag(accessToken, tagName)` - 创建标签
- `getUserTags(accessToken)` - 获取公众号已创建的标签
- `updateUserTag(accessToken, tagId, tagName)` - 编辑标签
- `deleteUserTag(accessToken, tagId)` - 删除标签
- `getTagUserList(accessToken, tagId, nextOpenId)` - 获取标签下粉丝列表
- `batchTagging(accessToken, tagId, openIds, return_fail_openid)` - 批量为用户打标签
- `batchUntagging(accessToken, tagId, openIds, return_fail_openid)` - 批量为用户取消标签
- `getUserTagList(accessToken, openId)` - 获取用户身上的标签列表
- `setUserRemark(accessToken, openId, remark)` - 设置用户备注名
- `getUserInfo(accessToken, openId, lang)` - 获取用户基本信息（UnionID 机制）
- `getUserList(accessToken, nextOpenId)` - 获取用户列表
- `getBlackList(accessToken, beginOpenId)` - 获取黑名单列表
- `batchBlackList(accessToken, openIds)` - 拉黑用户
- `batchUnBlackList(accessToken, openIds)` - 取消拉黑用户

## 注意事项

- 文件上传大小限制:
  - 图片（image）：10MB，支持 PNG、JPEG、JPG、GIF 格式
  - 语音（voice）：2MB，播放长度不超过 60s，支持 AMR、MP3 格式
  - 视频（video）：10MB，支持 MP4 格式
  - 缩略图（thumb）：64KB，支持 JPG 格式
- 临时素材的 media_id 有效期为 3 天
- 接口调用频率受微信官方限制，请合理使用

## 开发指南

### 环境安装

克隆项目后安装依赖：

```bash
git clone https://github.com/zippybee/wechat-kit.git
cd wechat-kit
npm install
```

### 开发模式

```bash
npm run dev
```

这将启动 Rollup 的监视模式，在您修改源代码时自动重新构建。

### 构建生产版本

```bash
npm run build
```

## 贡献指南

我们非常欢迎各位开发者参与贡献，一起完善这个项目！

### 如何贡献

1. **Fork 本仓库**：点击 GitHub 页面右上角的 Fork 按钮
2. **创建特性分支**：`git checkout -b feature/your-new-feature`
3. **提交你的改动**：`git commit -am '添加一些特性'`
4. **推送到分支**：`git push origin feature/your-new-feature`
5. **提交 Pull Request**：在 GitHub 上提交 PR

### 贡献类型

我们欢迎各种形式的贡献，包括但不限于：

- 修复 bug
- 添加新功能
- 完善文档
- 优化性能
- 改进代码质量
- 添加测试用例

### 编码规范

- 遵循项目现有的代码风格
- 为新功能编写测试
- 保持代码简洁清晰
- 提交前使用适当的代码格式化工具

## 贡献者

感谢以下开发者对本项目的贡献：

<a href="https://github.com/zippybee/wechat-kit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=zippybee/wechat-kit" />
</a>

我们期待您的加入！无论是提交代码、报告问题还是提出建议，每一份贡献都将帮助我们打造更好的微信开发工具包。

## 环境要求

- Node.js >= 18.0.0
- TypeScript >= 5.0.0 (如果使用 TypeScript)

## 许可证

ISC
