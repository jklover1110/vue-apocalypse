import { initMixin } from './init';
import { _init } from '../constants';
import { lifecycleMixin } from './lifecycle';
import { stateMixin } from './state';

export default class View {
  constructor(options) {
    this[_init](options);
  }
}

initMixin(View);
stateMixin(View);
lifecycleMixin(View);
