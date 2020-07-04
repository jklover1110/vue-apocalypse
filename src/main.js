import View from './view2';

const vm = new View({
  el: '#app',
  data: () => ({
    cat: 'cat',
    girl: {
      name: 'daisy'
    },
    lib: [{ name: 'view' }]
  }),
  computed: {
    love() {
      return `${this.cat} loves ${this.girl.name}`;
    }
  },
  watch: {
    cat(value, oldValue) {
      console.log(
        `user watcher: newValue => ${value}, oldValue => ${oldValue}`
      );
    }
  }
});

Reflect.set(window, 'vm', vm);

setTimeout(() => {
  vm.cat = 'leo';
}, 2222);
