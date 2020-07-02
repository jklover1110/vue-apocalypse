import { initState } from './state';
import { _init } from '../constants';
import { isString } from '../utils';
import { createCompiler } from '../../compiler';

const query = el => (isString(el) ? document.querySelector(el) : el);

const init = function(options) {
  Reflect.set(this, '$options', options);
  initState(this);

  let {
    $options: { el }
  } = this;

  el = query(el);

  el && Reflect.set(this, '$el', el) && createCompiler(this);

  // el && this.$mount(el);
};

const initMixin = View => Reflect.set(View.prototype, _init, init);

export { initMixin };
