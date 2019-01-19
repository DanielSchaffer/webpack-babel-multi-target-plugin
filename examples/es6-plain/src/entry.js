import { createDom } from '../../es6-dom'
import { makeItGreen } from './make.it.green'

function check(bind = false) {
  if (['complete', 'interactive'].includes(document.readyState)) {
    return init()
  }
  if (bind) {
    document.onreadystatechange = () => check.bind(null, false)
  }
}

async function init() {
  const dom = createDom('es6-plain')

  makeItGreen()

  dom.setStatus('good to go!')
}

check(true)
