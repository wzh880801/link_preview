# 链接预览功能代码示例 - NodeJS

## 目录说明
```
├── api.js                        // HTTP API
├── callback_handlers             // 响应各种回调的handler
│   ├── act.js                    // 用户点击卡片按钮进行交互时触发
│   ├── del.js                    // 用户撤回消息时触发
│   ├── get.js                    // 用户查看消息时触发
│   ├── head.js                   // 用户在消息输入框输入 URL 时触发
│   └── new.js                    // 用户发送消息后触发
├── common.js                     // 通用方法，如签名计算，解密等
├── config.js                     // 配置文件
├── interfaces.ts
├── lark_sdk.js                   // 对开放平台一些方法的封装
├── package.json
├── parser                        // 数据爬取器
│   └── zh_parser.js              // 知乎某图书页面的信息获取示例
└── router.js                     // 路由器，识别协议类型，调用对应 handler
```
注：仅做演示使用，请遵守网站 robots 协议

## 先看最终的效果
![前后效果对比](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-161723.png)


## 前置准备
1. 开发者后台创建一个应用，并添加应用能力 机器人 和 链接预览，开通权限：获取与上传图片或文件资源，发版生效
2. 链接预览菜单中，配置域名回调配置，注册需要预览的域名
![配置](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-162117.png)
3. 设计如下卡片
![](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-163427.png)
![](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-163555.png)

## 部署代码
1. fork 代码到本地
2. 打开 `config.js`
* 填写 `APP_ID` 和 `APP_SECRET` 的值，可以在`开发者后台` - `「应用」` - `凭证与基础信息`里获取
* 填写 `ENCRYPT_KEY` 和 `VERIFICATION_TOKEN` 的值，可以在`开发者后台` - `「应用」` - `链接预览` - `域名回调配置` 里获取
3. 进入到代码根目录，执行 `npm install`
4. 执行 `node api.js`
![run](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-162757.png)
5. 使用 nginx 设置反向代理，设置域名等，让站点可以被公网访问
![nginx](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-171207.png)
6. 当在 IM 中发送匹配的 URL 时，就会收到对应的事件推送
![](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-163950.png)
![](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-164033.png)
![show](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-1640491.png)
![](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-163344.png)

## 链接预览流程说明
![](https://galaxy-imgs.oss-cn-beijing.aliyuncs.com/screenshot-20230727-175343.png)