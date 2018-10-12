import { someEs6 }     from './some.es6.js';

console.log('entry!', someEs6('hey!'));

const button = document.createElement('button');
button.textContent = 'make it green!';
button.onclick = async () => {
    const greener = await import('./make.it.green');
    greener.makeItGreen();
}
