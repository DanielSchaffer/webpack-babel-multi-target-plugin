import { Dependency } from './dependency';
import { fromPairs } from 'lodash';

const things: string[] = [
    'thing 1',
    'thing 2',
    'thing 3',
    'thing 4',
    'thing 5',
];

const dep = new Dependency();
const logger = dep.log(...things, fromPairs(things.map(thing => [thing, thing.split('').reverse().join('')])));
logger();