/*
   Define a property.
   给对象定义一个不可枚举的属性。
*/
const def = (obj, key, value) =>
  Reflect.defineProperty(obj, key, {
    enumerable: !1,
    configurable: !0,
    writable: !0,
    value
  });

/*
  Parse simple path.
  解析简单路径。
*/
const parsePath = path => obj =>
  path.split('.').reduce((obj, key) => obj[key], obj);

/*
  遍历对象自身可枚举属性，
  执行对应回调函数
*/
const keys4Each = (obj, callback) =>
  Reflect.ownKeys(obj)
    .filter(key => Reflect.getOwnPropertyDescriptor(obj, key).enumerable)
    .forEach(key => callback(obj, key));

export { def, parsePath, keys4Each };
