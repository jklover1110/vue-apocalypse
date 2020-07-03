import { _update } from '../constants';
import { createCompiler } from '../../compiler';
// import { createWatcher } from '../observer/watcher';

const lifecycleMixin = View => {
  const updateComponent = function() {
    createCompiler(this);
  };

  Reflect.set(View.prototype, _update, updateComponent);

  const $mount = function() {
    const mountComponent = () => createCompiler(this);

    mountComponent();
    // createWatcher(this, this[_update]);
  };

  Reflect.set(View.prototype, '$mount', $mount);
};

export { lifecycleMixin };
