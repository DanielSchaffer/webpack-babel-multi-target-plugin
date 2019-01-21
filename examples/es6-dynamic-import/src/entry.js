import { createDom } from '../../_shared/es6-dom'
import { es6 } from '../../_shared/logos'
import ready from '../../_shared/ready'

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

  const greener = await import('../../_shared/make.it.green')
  greener.makeItGreen()

  dom.setStatus('good to go!')
  ready()
}

check(true)
