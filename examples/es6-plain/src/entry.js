import { createDom } from '../../_shared/es6-dom'
import { makeItGreen } from '../../_shared/make.it.green'
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
  const dom = createDom('es6-plain', es6)

  makeItGreen()

  dom.setStatus('good to go!')
  ready()
}

check(true)
