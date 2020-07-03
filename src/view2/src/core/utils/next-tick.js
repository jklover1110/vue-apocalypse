const callbacks = [];
let pending = !1;

const flushCallbacks = () => {
  pending = !1;

  const copies = [...callbacks];

  callbacks.length = 0;

  copies.forEach(cb => cb());
};

let timerFunc = null;

if (void 0 !== typeof Promise) {
  const p = Promise.resolve();

  timerFunc = () => p.then(flushCallbacks);
} else if (void 0 !== typeof setImmediate) {
  timerFunc = () => setImmediate(flushCallbacks);
} else {
  timerFunc = () => setTimeout(flushCallbacks, 0);
}

const nextTick = cb => {
  callbacks.push(() => cb());

  if (!pending) {
    pending = !0;

    timerFunc();
  }
};

export { nextTick };
