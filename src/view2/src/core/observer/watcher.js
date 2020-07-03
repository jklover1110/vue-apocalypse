import { isFunction, parsePath } from '../utils';
import { pushTarget, popTarget } from './dep';
import { queueWatcher } from './scheduler';

let uid = 0;

/*
  A watcher parses an expression, collects dependencies,
  and fires callback when the expression value changes.
  This is used for both the $watch() api and directives.

  当表达式的值改变时，watcher 观察者对象会解析表达式，收集依赖和触发回调。
  这个机制适用于 $watch() api 和指令。
*/
export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;

    if (options) {
      const { user } = options;

      this.user = user;
    } else {
      this.user = !1;
    }

    this.cb = cb;
    this.id = uid++;
    this.deps = [];
    this.depIds = new Set();

    /*
      parse expression for getter

      解析表达式作为 getter
    */
    this.getter = isFunction(expOrFn) ? expOrFn : parsePath(expOrFn);

    this.value = this.get();
  }

  /*
    Evaluate the getter, and re-collect dependencies.

    评估 getter，重新收集依赖
  */
  get() {
    pushTarget(this);

    const { vm } = this;
    const value = this.getter.call(vm, vm);

    popTarget();

    return value;
  }

  /*
    Add a dependency to this directive.

    给当前指令添加依赖。
  */
  addDep(dep) {
    const { id } = dep;

    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  /*
    Subscriber interface.
    Will be called when a dependency changes.

    订阅者接口。
    当依赖改变是被调用。
  */
  update() {
    queueWatcher(this);
  }

  /*
    Scheduler job interface.
    Will be called by the scheduler.

    调度程序工作接口。
    将被调度程序调用。
  */
  run() {
    const value = this.get();
    const { value: oldValue } = this;

    if (value !== oldValue) {
      this.value = value;

      this.cb.call(this.vm, value, oldValue);
    }
  }
}

const createWatcher = (vm, expOrFn, cb, options) =>
  new Watcher(vm, expOrFn, cb, options);

export { createWatcher };
