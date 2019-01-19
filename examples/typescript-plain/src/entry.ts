import { createDom } from '../../_shared/es6-dom'
import { typescript } from '../../_shared/logos'
import { makeItGreen } from '../../_shared/make.it.green'

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
