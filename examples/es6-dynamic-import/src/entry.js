import { createDom } from '../../_shared/es6-dom'
import { es6 } from '../../_shared/logos'
import ready from '../../_shared/ready'

// needed to trigger Babel including array.es6.iterator polyfill
// see https://github.com/DanielSchaffer/babel-ie11-dynamic-import-array-iterator-repro
Promise.all([])

function check(bind = false) {
  if (['complete', 'interactive'].indexOf(document.readyState) >= 0) {
    document.onreadystatechange = undefined
    return init()
  }
  if (bind) {
    document.onreadystatechange = check.bind(null, false)
  }
}

async function init() {
  const dom = createDom('es6-dynamic-import', es6)

  const greener = await import('../../_shared/make.it.green')
  greener.makeItGreen()

  dom.setStatus('good to go!')
  ready()
}

check(true)
