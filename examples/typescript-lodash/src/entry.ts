import { fromPairs, invert, isBuffer } from 'lodash-es';
import * as qs from 'querystring-es3';

import { Dependency }  from './dependency';
import { makeItGreen } from './make.it.green';

const things: string[] = [
    'thing 1',
    'thing 2',
    'thing 3',
    'thing 4',
    'thing 5',
];

const reversed = fromPairs(things.map(thing => [thing, thing.split('').reverse().join('')]));
// const reversed = {};
const inverted = invert(reversed);
// const inverted = '';
const isb = isBuffer(inverted);
// const isb = '';

const dep = new Dependency();
const logger = dep.log(...things, reversed, inverted, isb, qs.encode({ foo: 'bar' }));
logger();

makeItGreen();
