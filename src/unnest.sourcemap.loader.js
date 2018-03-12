// this is written in JS because webpack doesn't seem to like loading .ts extensions
// for loaders even when using ts-node

/**
 * Un-nests sources from the original compilation so we don't end up with things like
 * webpack:///webpack:///./src/etc.ts
 */
module.exports = function testSourcemapLoader(content, map, meta) {
    map.sources = map.sources
        .map(source => {
            if (source.match(/\$_lazy_route_resource|ng(?:factory|style)/)) {
                // separate generated angular stuff into its own section
                return source.replace('webpack:///', '(angular)/');
            }
            return source.replace('webpack:///', './')
        });

    this.callback(null, content, map, meta);
    return void(0);
};
