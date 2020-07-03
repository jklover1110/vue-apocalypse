import { isFunction, isPlainObject, keys4Each, isString } from '../utils';
import { observe } from '../observer';
import { createWatcher as watcherFactory } from '../observer/watcher';
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

const createWatcher = (vm, expOrFn, handler, options) => {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }

  if (isString(handler)) {
    handler = vm[handler];
  }

  return vm.$watch(expOrFn, handler, options);
};

const initWatch = (vm, watch) =>
  keys4Each(watch, (watch, key) => {
    const handler = watch[key];

    if (Array.isArray(handler)) {
      handler.forEach(callback => createWatcher(vm, key, callback));
    } else {
      createWatcher(vm, key, handler);
    }
  });

const initState = vm => {
  const { data, watch } = vm.$options;

  data ? initData(vm) : Reflect.set(vm, _data, {}) && observe(vm[_data]);

  watch && initWatch(vm, watch);
};

const stateMixin = View => {
  const dataDef = {};

  const get = function() {
    return this._data;
  };

  Reflect.set(dataDef, 'get', get);
  Reflect.defineProperty(View.prototype, '$data', dataDef);

  const $watch = function(expOrFn, cb, options = {}) {
    if (isPlainObject(cb)) {
      createWatcher(this, expOrFn, cb, options);
    } else {
      watcherFactory(this, expOrFn, cb, options);
    }
  };

  Reflect.set(View.prototype, '$watch', $watch);
};

export { initState, stateMixin };
