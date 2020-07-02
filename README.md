# Vue.js 源码启示录

Vue.js 源码学习记录仓库，源码部分实现，问题记录......

> Note: 本仓库仅实现 Vue.js 核心 MVVM 功能，未考虑兼容性，未实现 AST 语法树和模板编译等功能，仅供参考。

## I. 深入响应式原理

### 1. initData()

初始化数据

### 2. observe()

观察数据

- Observer 观察者类

  - 添加观察者标记
  - 对象劫持
  - 数组劫持

#### 对象属性劫持

- defineReactive()
  - 遍历属性，定义响应式
  - 属性劫持，代理存取访问器
  - 递归代理嵌套对象
  - 递归代理新值

#### 数组变异方法劫持

- observeArray()
  遍历元素，代理嵌套对象
- protoAugment() / copyAugment()
  原型链劫持，扩展数组方法

### 3. proxy()

数据代理

## II. 模板编译

> 官方大致实现流程： 解析标签和内容 => 生成 AST 语法树 => 生成代码 => 生成 render() 渲染函数

### 1. createDocumentFragment()

创建文档片段，将元素附加到文档片段

### 2. compiler()

在于内存中进行模板编译

#### 编译模板插值「Mustache 语法」

#### 编译特殊 `attribute`「指令」

- v-text

### 3. 将文档片段附加到 DOM 树

在 DOM 树中，文档片段被其所有的子元素所代替。
