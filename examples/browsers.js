module.exports.modern = [
    // The last two versions of each browser, excluding versions
    // that don't support <script type="module">.
    'last 2 Chrome versions', 'not Chrome < 60',
    'last 2 Safari versions', 'not Safari < 10.1',
    'last 2 iOS versions', 'not iOS < 10.3',
    'last 2 Firefox versions', 'not Firefox < 54',
    'last 2 Edge versions', 'not Edge < 15'
];

module.exports.legacy = [
    '> 1%',
    'last 2 versions',
    'Firefox ESR'
];