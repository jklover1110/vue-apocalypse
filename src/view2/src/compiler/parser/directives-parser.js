import { parsePath } from '../../core/utils';

const parseText = (exp, node, vm) => {
  node.textContent = parsePath(exp)(vm);
};

const directive2Parser = new Map().set('text', parseText);

export { directive2Parser };
