import { isObject, keys4Each, def } from '../utils';
import { __ob__ } from '../constants';

/*
  Define a reactive property on an Object.

  给对象定义一个响应式属性。
*/
const defineReactive = (obj, key, value = obj[key]) => {
  /*
    recursion to observe the value
    because the value may be a nested object

    递归代理嵌套对象
  */
  observe(value);

  Reflect.defineProperty(obj, key, {
    enumerable: !0,
    configurable: !0,
    get() {
      return value;
    },
    set(newValue) {
      if (value === newValue) return;

      value = newValue;

      /*
        recursion to observe the newValue
        because typeof newValue may be 'object'

        递归代理新值
      */
      observe(newValue);
    }
  });
};

/*
  Observer class that is attached to each observed
  object.
  Once attached, the observer converts the target
  object's property keys into getter/setters that
  collect dependencies and dispatch updates.

  附加到每个被观察对象的观察者类。
  附加之后，
  观察者会将目标对象所有的属性键转化为 getter/setters（取值函数/存值函数），
  以此实现依赖收集和调度更新。
*/
class Observer {
  constructor(obj) {
    /*
      给目标对象定义一个 '__ob__' 属性，
      标记目标对象已被观察，
      防止同一个值被重复观察
    */
    def(obj, __ob__, this);

    this.walk(obj);
  }

  /*
    Walk through all properties and convert them into
    getter/setters.
    This method should only be called when
    value type is Object.

    遍历所有属性并将祂们转化为取值函数/存值函数。
    当值类型是 Object 该方法才会被调用。
  */
  walk(obj) {
    keys4Each(obj, defineReactive);
  }
}

/*
  Attempt to create an observer instance for a value,
  returns the new observer if successfully observed,
  or the existing observer if the value already has one.

  尝试根据值创建一个观察者实例，
  若成功观察，则返回一个新观察者，
  若该值已被附加了观察者，则返回该值所附加的观察者
*/
function observe(value) {
  if (!isObject(value)) return;

  const ob =
    (Reflect.has(value, __ob__) && Reflect.get(value, __ob__)) || void 0;

  return ob instanceof Observer ? ob : new Observer(value);
}

export { Observer, observe };
