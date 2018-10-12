import dep from './dependency';
const foo = 'bar';

export const someEs6 = (thing) => {
    dep();
    return `${foo}${thing}`;
};