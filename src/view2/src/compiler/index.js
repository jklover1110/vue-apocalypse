import { defaultTagRE, parseMustache, directive2Parser } from './parser';

export default class Compiler {
  static createInstance(vm) {
    return new this(vm);
  }

  constructor(vm) {
    this.vm = vm;

    const { $el: el } = vm;

    const fragment = this.node2Fragment(el);

    this.compile(fragment);
    el.appendChild(fragment);
  }

  node2Fragment(node) {
    const fragment = document.createDocumentFragment();
    let firstChild = null;

    while ((firstChild = node.firstChild)) {
      fragment.appendChild(firstChild);
    }

    return fragment;
  }

  isElementNode({ nodeType }) {
    return 1 === nodeType;
  }

  isTextNode({ nodeType }) {
    return 3 === nodeType;
  }

  isDirective(value) {
    return value.startsWith('v-');
  }

  compileTextNode(node) {
    const { textContent } = node;

    defaultTagRE.test(textContent) && parseMustache(textContent, node, this.vm);
  }

  compileElementNode(node) {
    [...node.attributes].forEach(({ name, value }) => {
      if (this.isDirective(name)) {
        const [, directive] = name.split('-');

        directive2Parser.has(directive) &&
          directive2Parser.get(directive)(value, node, this.vm);
      }
    });
  }

  compile({ childNodes }) {
    [...childNodes].forEach(node => {
      if (this.isTextNode(node)) {
        this.compileTextNode(node);
      } else if (this.isElementNode(node)) {
        this.compileElementNode(node);
        this.compile(node);
      }
    });
  }
}

const createCompiler = options => Compiler.createInstance(options);

export { createCompiler };
