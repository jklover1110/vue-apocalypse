import { parsePath } from '../../core/utils';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

const parseMustache = (text, node, vm) => {
  node.textContent = text.replace(defaultTagRE, (...args) =>
    parsePath(args[1])(vm)
  );
};

export { defaultTagRE, parseMustache };
