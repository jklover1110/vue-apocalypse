import { nextTick } from '../utils/next-tick';
/*
  { id => watcher }
*/
const id2Watcher = new Map();

let waiting = !1;
let flushing = !1;

/*
  Reset the scheduler's state.

  重置调度程序状态。
*/
const resetSchedulerState = () => {
  id2Watcher.clear();

  waiting = flushing = !1;
};

/*
  Flush both queues and run the watchers.

  清空队列，运行 watcher。
*/
const flushSchedulerQueue = () => {
  flushing = !0;
  /*
    Sort queue before flush.
    This ensures that:
    1. Components are updated from parent to child.
       (because parent is always created before the child)
    2. A component's user watchers are run before its render watcher
       (because user watchers are created before the render watcher)
    3. If a component is destroyed during a parent component's watcher run,
       its watchers can be skipped.

    清空前先给队列排序。
    这能确保以下情况：
    1. 组件更新先父后子。
      （因为父组件创建总是先于子组件）
    2. 组件的 user watchers 运行先于祂的 render watcher
      （因为 user watchers 创建先于 render watcher）
    3. 如果组件在父组件运行期间销毁，该组件的 watchers 会被忽略。
  */
  /*
    do not cache length because more watchers might be pushed
    as we run existing watchers

    不缓存数组长度因为当我们运行现存 watchers 的时候可能会推入更多 watchers
 */
  /*
    [...id2Watcher.values()]
    .sort((a, b) => a.id - b.id)
    .forEach(watcher => {
      watcher.run();
      id2Watcher.delete(watcher.id);
    });
  */
  [...id2Watcher.keys()]
    .sort((a, b) => a - b)
    .forEach(id => {
      id2Watcher.get(id).run();
      id2Watcher.delete(id);
    });

  resetSchedulerState();
};

/*
  Push a watcher into the watcher queue.
  Jobs with duplicate IDs will be skipped unless it's
  pushed when the queue is being flushed.

  推入 watcher 推入 watcher 队列。
  除非 watcher 实在队列清空时推入，
  否则有重复 ID 的工作会被忽略。
*/
const queueWatcher = watcher => {
  const { id } = watcher;

  if (!id2Watcher.has(id)) {
    !flushing && id2Watcher.set(id, watcher);

    if (!waiting) {
      waiting = !0;

      nextTick(flushSchedulerQueue);
    }
  }
};

export { queueWatcher };
