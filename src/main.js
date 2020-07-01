import View from './view2';

const vm = new View({
  el: '#app',
  data: () => ({
    cat: 'leo',
    girl: {
      name: 'daisy'
    }
  })
});

Reflect.set(window, 'vm', vm);
