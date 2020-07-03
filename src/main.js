import View from './view2';

const vm = new View({
  el: '#app',
  data: () => ({
    cat: 'leo',
    girl: {
      name: 'daisy'
    },
    lib: [{ name: 'view' }]
  }),
  watch: {
    cat() {
      console.log(this.cat);
    }
  }
});

Reflect.set(window, 'vm', vm);
