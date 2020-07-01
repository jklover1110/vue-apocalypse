import View from './view2';

const vm = new View({
  el: '#app',
  data: () => ({
    cat: 'leo',
    girl: {
      name: 'daisy'
    },
    lib: [{ name: 'view' }]
  })
});

Reflect.set(window, 'vm', vm);
