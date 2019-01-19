import { createDom } from '../../es6-dom'
import { es6 } from '../../logos'

function check(bind = false) {
  if (['complete', 'interactive'].includes(document.readyState)) {
    return init()
  }
  if (bind) {
    document.onreadystatechange = () => check.bind(null, false)
  }
}

async function init() {
  const dom = createDom('es6-dynamic-import', es6)

  const greener = await import('../../make.it.green')
  greener.makeItGreen()

  dom.setStatus('good to go!')
}

check(true)
