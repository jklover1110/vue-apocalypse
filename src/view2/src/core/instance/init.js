import { initState } from './state';
import { _init } from '../constants';
import { isString } from '../utils';

const init = function(options) {
  Reflect.set(this, '$options', options);
  initState(this);

  let { el } = options;

  const query = el => (isString(el) ? document.querySelector(el) : el);

  el = query(el);

  el && Reflect.set(this, '$el', el) && this.$mount();
};

const initMixin = View => Reflect.set(View.prototype, _init, init);

export { initMixin };
