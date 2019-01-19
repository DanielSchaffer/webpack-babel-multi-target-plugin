import * as $ from 'jquery'

import { createDom } from '../../es6-dom'
import { makeItGreen } from '../../make.it.green'
import { es6 } from '../../logos'

async function init() {
  const dom = createDom('es6-externals', es6)

  makeItGreen()
  dom.setStatus('good to go!')
}

$(init)
