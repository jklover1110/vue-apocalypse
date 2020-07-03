# Vue.js 源码启示录

Vue.js 源码学习记录仓库，源码部分实现，问题记录......

> Note: 本仓库仅实现 Vue.js 核心 MVVM 功能，未考虑兼容性，未实现 AST 语法树和模板编译等功能，仅供参考。

## I. 深入响应式原理

### 1. 实例初始化

- initState()
  状态初始化

  - initData()
    数据初始化

### 2. 数据劫持

- observe()

  - 忽略普通值
  - 忽略已观察对象，防止重复代理

- createObserver()
  - 定义不可枚举属性，标记已观察对象
  - 对象劫持
  - 数组劫持

#### 对象属性劫持

- defineReactive()
  - 遍历属性，定义响应式
  - 属性劫持，代理存取访问器
  - 递归代理嵌套对象
  - 递归代理新值

#### 数组变异方法劫持

- protoAugment() / copyAugment()
  原型链劫持，扩展数组方法
- observeArray()
  - 遍历当前元素，代理嵌套对象
  - 遍历新增元素，代理嵌套对象

### 3. 数据代理

proxy()

## II. 模板编译

> 官方大致实现流程： 解析标签和内容 => 生成 AST 语法树 => 生成代码 => 生成 render() 渲染函数

### 1. 编译模板

createCompiler()

### 2. 生成文档片段

node2Fragment()

- createDocumentFragment() | new DocumentFragment()
  创建文档片段
- 将元素附加到文档片段

#### 3. compiler()

在于内存中进行模板编译

- 编译元素节点
- 编译文本节点

#### 编译模板插值「Mustache 语法」

parseMustache()

#### 编译特殊 `attribute`「指令」

- v-text
  parseText()
- v-model
  parseModel()

### 4. 将文档片段附加到 DOM 树

在 DOM 树中，文档片段被其所有的子元素所代替。

## III. 创建渲染 watcher

- createWatcher()
  初始化渲染 watcher

## IV. 合并生命周期

## V. 依赖收集

### 1. 在渲染时存储 watcher

### 2. 对象的依赖收集

- dep.depend()
- childOb.dep.depend()

### 3. 数组的依赖收集

dependArray()

## VI. 异步更新队列

### 1. 更新队列

- resetSchedulerState()
  状态重置

- flushSchedulerQueue()
  任务排序，清空队列

- queueWatcher()
  watcher 去重，性能优化
  异步更新

### 2. 异步更新机制

- flushCallbacks()
  清空回调

- timerFunc()
  环境适配，优雅兼容
