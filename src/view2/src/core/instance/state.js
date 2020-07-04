import { isFunction, isPlainObject, keys4Each, isString } from '../utils';
import { observe } from '../observer';
import { createWatcher } from '../observer/watcher';
import { _data, _computedWatchers } from '../constants';
import Dep from '../observer/dep';

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
  let { data = {} } = vm.$options;

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

const computedWatcherOptions = { lazy: true };

const createComputedGetter = key =>
  function() {
    const watcher = this[_computedWatchers] && this[_computedWatchers][key];

    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    }
  };

const defineComputed = (target, key, userDef) => {
  const computedDefinition = { ...sharedPropertyDefinition };
  let get = null;

  console.log('defineComputed');

  if (isFunction(userDef)) {
    get = createComputedGetter(key);
  } else {
    get = userDef.get && createComputedGetter(key);
  }

  Reflect.set(computedDefinition, 'get', get);
  Reflect.defineProperty(target, key, computedDefinition);
};

const initComputed = (vm, computed) =>
  keys4Each(computed, (computed, key) => {
    const userDef = computed[key];

    const getter = isFunction(userDef) ? userDef : userDef.get;

    /*
      create internal watcher for the computed property.

      为计算属性创建内置 watcher
    */
    const watchers = Object.create(null);

    Reflect.set(vm, _computedWatchers, watchers);

    watchers[key] = createWatcher(vm, getter, null, computedWatcherOptions);

    /*
      component-defined computed properties are already defined on the component prototype.
      We only need to define computed properties defined at instantiation here.

      组件定义的计算属性已经被定义在组件原型上。
      我们只需要定义在实例化时候定义的计算属性。
    */
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  });

const createUserWatcher = (vm, expOrFn, handler, options) => {
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
      handler.forEach(callback => createUserWatcher(vm, key, callback));
    } else {
      createUserWatcher(vm, key, handler);
    }
  });

const initState = vm => {
  const { data, watch, computed } = vm.$options;

  if (data) {
    initData(vm);
  } else {
    Reflect.set(vm, _data, {});
    observe(vm[_data]);
  }

  if (computed) {
    initComputed(vm, computed);
  }

  if (watch) {
    initWatch(vm, watch);
  }
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
      createUserWatcher(this, expOrFn, cb, options);
    } else {
      createWatcher(this, expOrFn, cb, options);
    }
  };

  Reflect.set(View.prototype, '$watch', $watch);
};

export { initState, stateMixin };
