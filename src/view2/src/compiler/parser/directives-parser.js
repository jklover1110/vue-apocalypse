import { parsePath } from '../../core/utils';
import { updateContent } from './mustache-parser';
import { createWatcher } from '../../core/observer/watcher';

const parseText = (exp, node, vm) => {
  const content = parsePath(exp)(vm);

  createWatcher(vm, exp, newValue => updateContent(node, newValue));

  updateContent(node, content);
};

const updateValue = (node, value) => {
  node.value = value;
};

const setValue = (vm, exp, value) =>
  exp
    .split('.')
    .reduce(
      (obj, key, index, arr) =>
        index === arr.length - 1 ? (obj[key] = value) : obj[key],
      vm
    );

const parseModel = (exp, node, vm) => {
  const value = parsePath(exp)(vm);

  createWatcher(vm, exp, newValue => updateValue(node, newValue));

  const onInput = e => setValue(vm, exp, e.target.value);

  node.addEventListener('input', onInput);

  updateValue(node, value);
};

const directive2Parser = new Map()
  .set('text', parseText)
  .set('model', parseModel);

export { directive2Parser };
