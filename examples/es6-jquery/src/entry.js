console.log('entry!')

import { GTG } from '../../_shared/constants'
import { createDom } from '../../_shared/es6-dom'
import { makeItGreen } from '../../_shared/make.it.green'
import { es6 } from '../../_shared/logos'
import ready from '../../_shared/ready'

require('./commonjs-five')

Promise.all([])

async function init() {
  const dom = createDom('es6-jquery', es6)

  makeItGreen()

  dom.setStatus(GTG)
  ready()
}

$(init)
