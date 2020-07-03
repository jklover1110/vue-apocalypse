import { initMixin } from './init';
import { _init } from '../constants';
import { lifecycleMixin } from './lifecycle';

export default class View {
  constructor(options) {
    this[_init](options);
  }
}

initMixin(View);
lifecycleMixin(View);
