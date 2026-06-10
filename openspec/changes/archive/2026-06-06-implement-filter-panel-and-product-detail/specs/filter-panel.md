# Filter Panel Specifications

## FP-1: 多维筛选面板展示

**Given** 用户访问 `/products` 页面
**When** 页面加载完成
**Then** 左侧显示筛选面板
**And** 面板包含以下筛选维度：
- 容量（Volume）：按钮组形式，选项为 50/100/250/500/1000/2000/5000ml
- 材质（Material）：复选框，选项从数据自动提取（Borosilicate 等）
- 壁厚（Wall Type）：复选框（Normal Wall / Heavy Wall）
- 精度等级（Accuracy Class）：复选框（Class A / Class B）
- 磨口类型（Joint Type）：复选框
- 价格区间（Price）：范围选择

## FP-2: 筛选条件 → URL 同步

**Given** 用户在当前页面选择了筛选条件（如容量=250ml + 材质=Borosilicate）
**When** 用户点击筛选选项
**Then** URL 更新为 `/products?volume=250&material=borosilicate`
**And** 页面不刷新（客户端路由）
**And** 浏览器历史记录更新，支持前进/后退

## FP-3: URL → 筛选条件恢复

**Given** 用户通过 URL `/products?volume=250,500&material=borosilicate` 访问
**When** 页面加载
**Then** 筛选面板自动选中 250ml、500ml 和 Borosilicate
**And** 产品列表只显示符合条件的变体

## FP-4: 多选筛选（同维度内 OR 逻辑）

**Given** 用户选中了容量 250ml 和 500ml
**When** 筛选执行
**Then** URL 中 volume 参数为 `250,500`
**And** 结果显示容量为 250ml **或** 500ml 的产品

## FP-5: 跨维度筛选（AND 逻辑）

**Given** 用户选中了容量=250ml 且材质=Borosilicate
**When** 筛选执行
**Then** 结果显示容量=250ml **且** 材质=Borosilicate 的产品

## FP-6: 筛选结果为空

**Given** 用户组合筛选条件后没有匹配的产品
**When** 筛选执行
**Then** 显示空状态："没有符合条件的产品，请调整筛选条件"
**And** 显示"清除筛选"按钮

## FP-7: 清除筛选

**Given** 用户已选择一个或多个筛选条件
**When** 用户点击"清除筛选"按钮
**Then** 所有筛选条件被重置
**And** URL 变回 `/products`
**And** 显示全部产品

## FP-8: 移动端响应式

**Given** 用户在移动设备（<768px 视口）上访问产品列表页
**When** 页面加载
**Then** 筛选面板默认隐藏
**And** 显示"筛选"按钮
**When** 用户点击"筛选"按钮
**Then** 筛选面板从底部以抽屉形式弹出
**When** 用户选择筛选条件后
**Then** 抽屉自动关闭，筛选结果即时应用

## FP-9: 筛选结果计数

**Given** 用户选择了筛选条件
**When** 筛选执行
**Then** 产品列表顶部显示"共 X 个产品"（X 为筛选后结果数）
**And** 产品网格中每张卡片显示具体的变体名称和价格
