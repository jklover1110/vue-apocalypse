import { isFunction, isPlainObject, keys4Each } from '../utils';
import { observe } from '../observer';
import { _data } from '../constants';

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true
};

const getData = (data, vm) => data.call(vm);

const proxy = (target, sourceKey, key) =>
  Reflect.defineProperty(target, key, {
    ...sharedPropertyDefinition,
    get() {
      return this[sourceKey][key];
    },
    set(newValue) {
      this[sourceKey][key] = newValue;
    }
  });

const initData = vm => {
  let {
    $options: { data = {} }
  } = vm;

  data = isFunction(data) ? getData(data, vm) : data;

  Reflect.set(vm, _data, data);

  /*
    data functions should return an object
    data() 函数配置项必须返回一个对象
  */
  !isPlainObject(data) && (data = {});

  keys4Each(data, (_, key) => proxy(vm, _data, key));

  /*
    observe data

    观察数据
  */
  observe(data);
};

const initState = vm => {
  const {
    $options: { data }
  } = vm;

  data ? initData(vm) : Reflect.set(vm, _data, {}) && observe(vm[_data]);
};

export { initState };
