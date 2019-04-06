function importPluginByExpression(plugin) {
  return import(/* webpackChunkName: "[resource]" */`./plugins/${plugin}/plugin.js`)
}

export function loadPlugin() {
  const pluginMatch = window.location.search.match(/\bplugin=([ab])\b/)
  const plugin = pluginMatch ? pluginMatch[1] : 'a'
  return importPluginByExpression(plugin)
}
