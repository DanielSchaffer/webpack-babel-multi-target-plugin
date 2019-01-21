import { includes } from 'lodash-es'

import { createDom } from '../../_shared/es6-dom'
import { typescript } from '../../_shared/logos'
import { makeItGreen } from '../../_shared/make.it.green'
import ready from '../../_shared/ready'

function check(bind: boolean = false) {
  if (includes(['complete', 'interactive'], document.readyState)) {
    return init()
  }
  if (bind) {
    document.onreadystatechange = () => check.bind(null, false)
  }
}

async function init() {
  const dom = createDom('typescript-lodash', typescript)

  makeItGreen()

  dom.setStatus('good to go!')
  ready()
}

check(true)
