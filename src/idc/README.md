# IDC 产品运营工作台

独立 React / JavaScript 工作台，沿用当前 Vite 工程。个人网站入口尚未接入。

## 本地运行

```sh
npm run dev
```

打开 `http://localhost:5174/idc-workbench-preview.html`。支持 `?page=demands&record=D-003` 等目标入口，页面标识为 `overview`、`demands`、`business`、`products`、`acceptance`、`cabinets`、`changes`、`resourceAnalysis`。不存在的记录保留对应列表；旧章节标识在 `navigation.js` 中兼容。

```sh
npm run test:idc
npm run build:idc
```

独立构建输出 `dist-idc/idc-workbench-preview.html` 和对应 assets。原个人网站构建入口保持独立。

## 组件接口

```jsx
import { IDCWorkbench } from './IdcWorkbench';

<IDCWorkbench initialPage="overview" initialRecordId={null} onClose={handleClose} />
```

未来接入作品集时可使用现有 Portal 容器：

```jsx
<IdcWorkbenchDialog
  open={open}
  target={{ pageId: 'demands', recordId: 'D-003' }}
  onClose={() => setOpen(false)}
/>
```

桌面容器基准 1164 × 652px，导航 200px，顶栏 72px；系统字体，标题 24px/500，正文 14px/400，说明 12px/400。内容区独立滚动。详情使用宽幅右侧原生模态窗口，视口边距20px；小屏16px。较小视口保留展开的桌面业务布局，通过容器滚动查看。

## 实现边界

- `IdcWorkbench.jsx`：会话状态、导航、目标记录、弹窗栈与通知。
- `domain.js`：不可变、一次提交的业务流转，容量/revision校验、核验快照、统计与报告。
- `initialData.json`：原HTML实际初始化后的完整数据，保留3需求、3业务、1产品、93物理机柜（90可出租）。
- `pages.jsx`、`Cabinets.jsx`、`ResourceAnalysis.jsx`：八个业务页面。
- `Details.jsx`、各 `*Detail.jsx`：需求、业务、产品、交付详情及配套表单。
- `reference.css`：原HTML样式加根命名空间；`workbench.css`覆盖用户新尺寸/字体及布局问题。
- `assets/reference-0.png`、`Icon.jsx`：原HTML横幅和SVG图标，无远程依赖。

原型基线 SHA-256：`bf7c4838b97a5cffcda7a1b9daf2cedf1601c5b7156b7f46e7d0833d80a6aaf7`。
最新用户明确的尺寸/字体和延后个人网站接入安排优先于PRD。

当前仅本地演示，无数据库、登录、真实消息或金额计算。刷新/关闭重开恢复预置数据，“重置演示”恢复全部会话数据。多层窗口用原生dialog隔离焦点，关闭恢复焦点，外层容器负责页面滚动锁及恢复。定时器、拖拽状态和报告下载对象URL按生命周期清理。
