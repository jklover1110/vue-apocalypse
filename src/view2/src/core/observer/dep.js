import { remove } from '../utils';

let uid = 0;

/*
  A dep is an observable that can have multiple
  directives subscribing to it.

  dep 实例是被多个指令所订阅的被观察者。
*/
export default class Dep {
  static target = null;

  id = uid++;
  subs = [];

  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    remove(this.subs, sub);
  }

  depend() {
    const { target } = this.constructor;

    target && target.addDep(this);
  }

  notify() {
    /*
      stabilize the subscriber list first
      subs aren't sorted in scheduler if not running async
      we need to sort them now to make sure they fire in correct order

      首先确定订阅者名单
      同步执行的情况下 subs 在调度程序中没有排序
      我们需要先给祂们排序确保祂们按正确顺序执行
    */

    [...this.subs].sort((a, b) => a.id - b.id).forEach(sub => sub.update());
  }
}

const createDep = () => new Dep();

/*
  The current target watcher being evaluated.
  This is globally unique
  because only one watcher can be evaluated at a time.

  当前正在解析的目标观察者 watcher。
  这是全局唯一的目标 watcher，
  因为同一时间只能解析一个 watcher。

  JS 主线程是单线程的。
*/
Dep.target = null;
const targetStack = [];

const pushTarget = target => {
  targetStack.push(target);
  Dep.target = target;
};

const popTarget = () => {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
};

export { pushTarget, popTarget, createDep };
