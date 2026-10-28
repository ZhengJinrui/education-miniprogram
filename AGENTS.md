# 启晨教育项目协作说明

## 后续任务的读取顺序

1. 开始任何任务前，先完整阅读 `docs/progress.md`，确认当前实现、验证证据和遗留问题。
2. 涉及产品范围、角色、流程或规则时，再完整阅读 `docs/product.md`。
3. 然后仅按任务需要读取相关页面、云函数和配置文件。
4. 不得把现有代码自动视为正确需求或已验收结果；用户最新明确要求优先，并同步更新项目文档。

## 项目定位与结构

当前正式交付物是微信小程序原生项目，入口目录为 `miniprogram/`。根目录的 `index.html`、`styles.css`、`app.js`、`web-name.js` 是早期网页原型遗留，不是当前运行入口，除非用户明确要求，否则不要继续维护网页版本。

```text
E:\EducationProject
├─ AGENTS.md
├─ docs/
│  ├─ product.md
│  └─ progress.md
├─ CLOUD_SETUP.md
└─ miniprogram/
   ├─ app.js / app.json / app.wxss
   ├─ project.config.json
   ├─ cloudbaserc.json
   ├─ pages/
   │  ├─ login/            登录、协议、资料授权选择
   │  ├─ profile-setup/    姓名/昵称与头像设置
   │  ├─ home/             首页、课表、助手入口
   │  ├─ courses/          课程列表与搜索
   │  ├─ course-detail/    课程详情
   │  ├─ practice/         同步学练
   │  ├─ assistant/        小启助手
   │  ├─ leave/            请假申请
   │  ├─ profile/          个人资料、积分、退出
   │  ├─ agreement/        用户协议
   │  └─ privacy/          隐私政策
   └─ cloudfunctions/
      ├─ login/
      ├─ updateProfile/
      ├─ chat/
      ├─ leave/
      ├─ approveLeave/
      └─ createOrder/
```

当前目录不是 Git 仓库，不要假设存在提交、分支或历史记录。

## 运行与部署

使用微信开发者工具导入：

```text
E:\EducationProject\miniprogram
```

- 页面代码修改后，在开发者工具中重新编译。
- 登录态相关测试必要时清除开发者工具缓存。
- 云函数修改后，右键对应函数，选择“上传并部署：云端安装依赖”。仅重新编译小程序不会更新云端函数。
- 部署前确认开发者工具当前云环境与 `miniprogram/app.js` 初始化的环境一致。
- WXML/WXSS 编译、微信授权、云数据库、云函数和真机行为必须在微信开发者工具或真机中验证，不能只靠命令行判断。

## 真实可用的本地检查命令

在 PowerShell、工作目录 `E:\EducationProject` 下执行。

检查全部 JavaScript 语法：

```powershell
Get-ChildItem miniprogram -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

检查主要 JSON 文件：

```powershell
node -e "const fs=require('fs'); ['miniprogram/app.json','miniprogram/project.config.json','miniprogram/cloudbaserc.json','miniprogram/sitemap.json'].forEach(p=>JSON.parse(fs.readFileSync(p,'utf8'))); console.log('JSON OK')"
```

检查云函数依赖声明：

```powershell
Get-ChildItem miniprogram/cloudfunctions -Directory | ForEach-Object { node -e "const p=require(process.argv[1]); if(!p.main||!p.dependencies||!p.dependencies['wx-server-sdk']) process.exit(1); console.log(p.name+' OK')" ($_.FullName + '\package.json') }
```

这些命令只证明语法、JSON 格式和依赖声明，不证明小程序编译、页面渲染、云端部署或业务流程成功。

## 长期开发约定

- 业务代码只在 `miniprogram/` 维护；除非用户明确要求，不同步扩展网页原型。
- API Key、支付密钥和证书不得写入小程序端或文档；使用云函数环境变量和平台安全配置。
- OpenID、教师权限、订单金额、积分等可信数据必须由云端校验，不能相信客户端直接传入的数据。
- 金额按“分”存储；积分变化应保存流水并保证幂等。
- 微信昵称、公开显示名、教学管理真实姓名、随机身份是不同概念，不能混用字段或文案。
- 未获得明确授权时不得沿用微信头像和昵称；退出登录至少要清除本地登录状态。
- 云函数修改后，要分别记录“本地检查结果”和“云端部署/联调结果”，不能把本地代码存在写成已上线。
- 新增集合或字段时，在 `docs/progress.md` 记录用途、权限和迁移影响。
- 产品规则变化时，在 `docs/product.md` 的决策记录中注明新规则替代的旧规则及原因。
- 遇到中文乱码、配置冲突或历史代码异常时，先确认源文件编码和开发者工具实际表现，不要根据终端乱码猜测并批量改写业务。

