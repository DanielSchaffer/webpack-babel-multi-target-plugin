import * as $ from 'jquery'

import { createDom } from '../../es6-dom'
import { makeItGreen } from './make.it.green'

async function init() {
  const dom = createDom('es6-externals')

  makeItGreen()
  dom.setStatus('good to go!')
}

$(init)
