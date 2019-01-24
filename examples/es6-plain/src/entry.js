import { GTG } from '../../_shared/constants'
import { createDom } from '../../_shared/es6-dom'
import { makeItGreen } from '../../_shared/make.it.green'
import { es6 } from '../../_shared/logos'
import ready from '../../_shared/ready'

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
  const dom = createDom('es6-plain', es6)

  makeItGreen()

  dom.setStatus(GTG)
  ready()
}

check(true)
