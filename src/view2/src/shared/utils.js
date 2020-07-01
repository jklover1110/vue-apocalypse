const isFunction = value => 'function' === typeof value;

const isString = value => 'string' === typeof value;

const isObject = value => value && 'object' === typeof value;

const isPlainObject = value =>
  '[object Object]' === Reflect.apply(Object.prototype.toString, value, []);

const remove = (arr, item) => {
  if (!arr.length) return;

  const index = arr.indexOf(item);

  if (index > -1) {
    return arr.splice(index, 1);
  }
};

export { isFunction, isString, isObject, isPlainObject, remove };
