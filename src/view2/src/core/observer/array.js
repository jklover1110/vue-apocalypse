import { def } from '../utils';
import { __ob__ } from '../constants';

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/*
  Intercept mutating methods and emit events

  劫持变异方法和触发事件
*/
methodsToPatch.forEach(method => {
  /*
    cache original method

    缓存原生方法
  */
  const { [method]: original } = arrayProto;

  def(arrayMethods, method, function(...args) {
    const result = Reflect.apply(original, this, args);
    const { [__ob__]: ob } = this;
    let inserted = void 0;

    const handler = () => {
      inserted = args;
    };

    const method2Handler = new Map()
      .set('push', handler)
      .set('unshift', handler)
      .set('splice', () => {
        [, , ...inserted] = args;
      });

    method2Handler.has(method) && method2Handler.get(method)();

    inserted && ob.observeArray(inserted);

    /*
      notify change

      通知改变
    */
    ob.dep.notify();

    return result;
  });
});

export { arrayMethods, methodsToPatch };
