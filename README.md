# minip

> 这是满足女朋友创建学习活动打卡需求的小程序


目前已经上线，环境大家搜索 `SomethingNeedToDo`进行浏览尝试


## 主要功能

1. 首页支持日历查询、不同日期活动数量展示
2. 创建主活动以及子活动
3. 选择不同类型的活动时间
4. 进行主活动以及子活动打卡功能

## 项目结构
```
minip
├─ README.md
├─ app.js                           // 主页面
├─ app.json                         // 主页面
├─ app.wxss                         // 主页面
├─ components
│  ├─ addIcon                       // 新增活动
│  │  ├─ addIcon.js
│  │  ├─ addIcon.json
│  │  ├─ addIcon.wxml
│  │  ├─ addIcon.wxss
│  │  └─ addTask.wxss
│  ├─ addRecord                     // 打卡页面
│  │  ├─ addRecord.js
│  │  ├─ addRecord.json
│  │  ├─ addRecord.wxml
│  │  └─ addRecord.wxss
│  ├─ dayShow                       // 主页“天”展示模块
│  │  ├─ config.js
│  │  ├─ dayShow.js
│  │  ├─ dayShow.json
│  │  ├─ dayShow.wxml
│  │  └─ dayShow.wxss
│  └─ monthShow                     // 主页“月”展示模块
│     ├─ config.js
│     ├─ monthShow.js
│     ├─ monthShow.json
│     ├─ monthShow.wxml
│     └─ monthShow.wxss
├─ config                           // 基础配置
│  ├─ api.js
│  ├─ common.js
│  ├─ config.js
│  └─ style
│     └─ icon.wxss
├─ custom-tab-bar                   // 自定义tab(x)
│  ├─ index.js
│  ├─ index.json
│  ├─ index.wxml
│  └─ index.wxss
├─ image
├─ jsconfig.json
├─ miniprogram_npm
├─ package-lock.json
├─ package.json
├─ pages
│  ├─ addTask                       // 新建活动页面
│  │  ├─ index.js
│  │  ├─ index.json
│  │  ├─ index.wxml
│  │  └─ index.wxss
│  ├─ index                         // 首页-日历展示页面
│  │  ├─ index.js
│  │  ├─ index.json
│  │  ├─ index.wxml
│  │  └─ index.wxss
│  ├─ list                          // 活动列表页
│  │  ├─ index.js
│  │  ├─ index.json
│  │  ├─ index.wxml
│  │  └─ index.wxss
│  ├─ logs                          // 日志页面(x)
│  │  ├─ logs.js
│  │  ├─ logs.json
│  │  ├─ logs.wxml
│  │  └─ logs.wxss
│  └─ member                        // 个人中心页面(x)
│     ├─ index.js
│     ├─ index.json
│     ├─ index.wxml
│     └─ index.wxss
├─ project.config.json
├─ project.private.config.json
├─ sitemap.json
├─ typings
└─ utils
   ├─ check.js
   └─ util.js

```