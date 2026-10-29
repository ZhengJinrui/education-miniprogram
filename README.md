<div align="center">

# 🌅 启晨教育 Qichen Education

### AI 驱动的微信教育小程序，让课程、学习与成长连接起来

[![WeChat Mini Program](https://img.shields.io/badge/WeChat-Mini%20Program-07C160?logo=wechat&logoColor=white)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![CloudBase](https://img.shields.io/badge/CloudBase-Serverless-0052D9)](https://cloud.tencent.com/product/tcb)
[![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-4D6BFE)](https://www.deepseek.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Open Source](https://img.shields.io/badge/Open%20Source-Learning%20Project-255E4F)](#参与贡献)

> 把热门课程、个人课表、请假审批、同步练习、成长积分和 AI 学习助手，装进一个轻量、易用的微信小程序。

**如果这个项目对你有启发，欢迎点一个 ⭐ Star。你的支持会推动它从教育产品原型成长为更完整的开源项目。**

</div>

---

## ✨ 为什么是启晨教育？

教育数字化正在从“把课程搬到线上”，走向更智能、更个性化的学习体验。启晨教育尝试将当下热门的 **AI Agent、Serverless 云开发、个性化学习、学习激励机制和隐私友好设计** 融入微信小程序：

- 🤖 **AI 学习伙伴**：通过云函数安全连接 DeepSeek，支持连续对话、预设语气和常见问题回答。
- 📅 **学习事务一体化**：课程、课表、教室、请假和审批集中管理。
- 🧠 **学练结合**：规划英语单词、数学计算等同步练习与即时反馈。
- 🎁 **成长激励**：通过练习积分与礼物兑换，让坚持被看见。
- ☁️ **Serverless 架构**：基于微信云开发，无需自行维护传统服务器。
- 🔐 **隐私优先**：API Key 仅保存在云函数环境变量中，公开仓库不包含真实 AppID 和云环境 ID。

## 🧩 功能全景

| 模块 | 功能设计 | 当前状态 |
|---|---|---|
| 首页 | 热门课程、个人课表、上课地点、AI 助手入口 | 🟡 原型与本地逻辑 |
| 课程中心 | 课程列表、课程详情、教师信息、模糊搜索 | 🟡 原型与本地数据 |
| 小启助手 | DeepSeek 对话、FAQ、语气配置、多轮上下文 | 🟡 已有代码，需配置云端 |
| 请假 | 选择课程和日期、提交申请、教师审批云函数 | 🟡 学生端骨架 |
| 同步学练 | 英语与数学练习、即时反馈、积分规划 | 🟡 演示逻辑 |
| 我的 | 用户资料、随机身份、积分、订单入口、退出登录 | 🟡 持续完善 |
| 微信支付 | 订单创建、支付参数、回调更新 | 🔴 待接入商户能力 |
| 教师端 | 请假列表、审批、课程与学生管理 | 🔴 待建设 |

> 状态说明：🟢 已完成并验证 · 🟡 已有实现但仍需云端/真机联调 · 🔴 规划中。项目不会把“代码已写”包装成“生产可用”。

## 🏗️ 技术架构

```text
微信小程序
├─ WXML / WXSS / JavaScript
├─ 登录、课程、课表、练习、资料与 AI 对话页面
└─ wx.cloud.callFunction
          │
          ▼
微信云开发 CloudBase
├─ 云函数：login / updateProfile / chat
├─ 云函数：leave / approveLeave / createOrder
├─ 云数据库：用户、课程、教师、请假、订单、积分
└─ 云存储：用户头像等文件
          │
          ▼
第三方服务
├─ DeepSeek API：AI 学习助手
└─ 微信支付：课程订单（规划中）
```

### 技术选型

- 微信小程序原生框架
- JavaScript ES6
- 微信云开发 / CloudBase
- 云数据库、云存储、云函数
- DeepSeek Chat Completions API
- `wx-server-sdk`

## 📂 项目结构

```text
.
├─ app.js / app.json / app.wxss
├─ pages/
│  ├─ login/             # 登录、协议和身份选择
│  ├─ profile-setup/     # 头像与名称设置
│  ├─ home/              # 首页、课表和助手入口
│  ├─ courses/           # 课程列表和搜索
│  ├─ course-detail/     # 课程详情
│  ├─ practice/          # 同步学练
│  ├─ assistant/         # 小启助手
│  ├─ leave/             # 请假申请
│  ├─ profile/           # 我的
│  ├─ agreement/         # 用户协议
│  └─ privacy/           # 隐私政策
├─ cloudfunctions/
│  ├─ login/
│  ├─ updateProfile/
│  ├─ chat/
│  ├─ leave/
│  ├─ approveLeave/
│  └─ createOrder/
└─ docs/
   ├─ product.md         # 已确认的产品规则
   └─ progress.md        # 实现、验证和后续计划
```

## 🚀 快速开始

### 1. 准备环境

- 安装微信开发者工具。
- 注册微信小程序并准备自己的 AppID。
- Fork 或 Clone 本仓库。

```bash
git clone https://github.com/ZhengJinrui/education-miniprogram.git
cd education-miniprogram
```

### 2. 导入项目

在微信开发者工具中选择“导入项目”，目录选择仓库根目录。

公开仓库的 `project.config.json` 使用：

```json
{
  "appid": "touristappid"
}
```

请在微信开发者工具中填写自己的 AppID。开发者工具生成的 `project.private.config.json` 已被 `.gitignore` 忽略，不会上传到公开仓库。

### 3. 开通云开发

在微信开发者工具中开通云开发环境。当前代码使用小程序绑定的默认云环境，不在公开代码中硬编码环境 ID。

建议创建以下数据库集合：

```text
users
courses
teachers
leave_requests
orders
points_ledger
ai_settings
chat_messages
```

数据库权限、字段说明和当前进度请参考：

- [`docs/product.md`](docs/product.md)
- [`docs/progress.md`](docs/progress.md)

### 4. 部署云函数

在开发者工具中分别右键 `cloudfunctions/` 下的函数，选择：

```text
上传并部署：云端安装依赖
```

优先部署：

```text
login
updateProfile
chat
leave
approveLeave
createOrder
```

### 5. 配置 DeepSeek

在 `chat` 云函数环境变量中设置：

```text
DEEPSEEK_API_KEY=你的 API Key
DEEPSEEK_MODEL=deepseek-flash
```

请勿把 API Key 写入小程序端代码、提交记录或 README。

### 6. 编译与体验

重新编译小程序，完成登录和资料设置后，即可进入首页体验现有功能。

## ✅ 本地代码检查

PowerShell：

```powershell
Get-ChildItem -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

检查主要 JSON：

```powershell
node -e "const fs=require('fs'); ['app.json','project.config.json','cloudbaserc.json','sitemap.json'].forEach(p=>JSON.parse(fs.readFileSync(p,'utf8'))); console.log('JSON OK')"
```

这些命令不能替代微信开发者工具中的编译、云函数部署和真机验证。

## 🔐 安全与隐私

- 真实 AppID 保存在本地私有配置中，不进入公开仓库。
- 云环境 ID 不在业务代码中硬编码。
- DeepSeek API Key 使用云函数环境变量。
- OpenID、教师权限、订单和积分等敏感业务数据应在云端校验。
- 登录前要求用户主动同意用户协议与隐私政策。
- 未授权使用微信资料时，可生成随机名称和随机头像。
- 证书、私钥、`.env`、日志和本地配置均已加入忽略规则。

> 项目内的协议和隐私政策文本目前是开发模板，正式上线前请完成法律审核并配置微信公众平台隐私保护指引。

## 🗺️ Roadmap

- [ ] 将课程、教师和课表迁移至云数据库
- [ ] 建设教师端请假审批工作台
- [ ] 完成题库、AI 批改和错题本
- [ ] 建立积分流水、防重复奖励与礼品兑换
- [ ] 接入真实微信支付和支付回调
- [ ] 增加 AI 调用额度、频率限制和内容安全
- [ ] 增加账号注销、数据删除和授权撤回
- [ ] 完善自动化检查与真机测试清单
- [ ] 补充产品截图、演示视频和体验二维码

## 🤝 参与贡献

欢迎所有关注以下方向的开发者参与：

- AI + 教育产品
- 微信小程序与 CloudBase
- DeepSeek 应用实践
- 教育机构数字化
- 未成年人隐私与 AI 安全
- UI/UX、题库、积分与游戏化学习

你可以通过以下方式支持项目：

1. 点亮右上角 ⭐ **Star**，让更多人看到它。
2. 提交 Issue，分享建议、Bug 或教育场景需求。
3. Fork 项目并提交 Pull Request。
4. 帮助完善文档、测试、交互和数据模型。

提交贡献前建议先阅读：

- [`AGENTS.md`](AGENTS.md)
- [`docs/product.md`](docs/product.md)
- [`docs/progress.md`](docs/progress.md)

## 📌 项目说明

这是一个持续开发中的开源教育小程序项目，适合用于：

- 微信小程序与云开发学习
- AI 教育产品原型研究
- 教培机构数字化方案参考
- Serverless 与大模型 API 集成实践

项目暂不代表已达到生产上线标准。支付、权限、内容安全、隐私合规和未成年人保护等能力，在正式运营前需要进一步完善和审核。

---

<div align="center">

### 🌱 每一个 Star，都是启晨教育继续成长的一束晨光

如果你也相信 AI 可以让学习更有温度，欢迎 Star、Fork 或参与贡献。

</div>
