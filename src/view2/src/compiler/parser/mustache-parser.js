import { parsePath } from '../../core/utils';
import { createWatcher } from '../../core/observer/watcher';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

const updateContent = (node, content) => {
  node.textContent = content;
};

const getContent = (text, vm) =>
  text.replace(defaultTagRE, (...args) => parsePath(args[1])(vm));

const parseMustache = (text, node, vm) => {
  const content = text.replace(defaultTagRE, (...args) => {
    const exp = args[1];

    createWatcher(vm, exp, () => updateContent(node, getContent(text, vm)));

    return parsePath(exp)(vm);
  });

  updateContent(node, content);
};

export { defaultTagRE, parseMustache, updateContent };
