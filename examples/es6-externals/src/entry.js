import * as $ from 'jquery'

import { createDom } from '../../_shared/es6-dom'
import { makeItGreen } from '../../_shared/make.it.green'
import { es6 } from '../../_shared/logos'

async function init() {
  const dom = createDom('es6-externals', es6)

  makeItGreen()
  dom.setStatus('good to go!')
}

$(init)
