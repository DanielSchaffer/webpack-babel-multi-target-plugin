import { createDom } from '../../es6-dom'
import { typescript } from '../../logos'
import { makeItGreen } from '../../make.it.green'

function check(bind: boolean = false) {
  if (['complete', 'interactive'].includes(document.readyState)) {
    return init()
  }
  if (bind) {
    document.onreadystatechange = () => check.bind(null, false)
  }
}

async function init() {
  const dom = createDom('typescript-plain', typescript)

  makeItGreen()

  dom.setStatus('good to go!')
}

check(true)
