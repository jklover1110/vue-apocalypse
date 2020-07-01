import { initState } from './state';
import { _init } from '../constants';

const initMixin = View => {
  Reflect.set(View.prototype, _init, function(options) {
    Reflect.set(this, '$options', options);

    initState(this);
  });
};

export { initMixin };
