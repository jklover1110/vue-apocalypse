import { initMixin } from './init';
import { _init } from '../constants';

export default class View {
  constructor(options) {
    this[_init](options);
  }
}

initMixin(View);
