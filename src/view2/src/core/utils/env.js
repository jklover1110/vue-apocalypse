/*
  检测 __proto__ 的环境兼容性
*/
const hasProto = () => '__proto__' in {};

export { hasProto };
