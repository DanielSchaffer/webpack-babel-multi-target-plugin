import { GTG } from '../../_shared/constants'
import { createDom } from '../../_shared/es6-dom'
import { typescript } from '../../_shared/logos'
import { makeItGreen } from '../../_shared/make.it.green'
import ready from '../../_shared/ready'

// @ts-ignore
import moment from 'moment'

function check(bind: boolean = false) {
  if (['complete', 'interactive'].includes(document.readyState)) {
    document.onreadystatechange = undefined
    return init()
  }
  if (bind) {
    document.onreadystatechange = check.bind(null, false)
  }
}

async function init() {
  const dom = createDom('typescript-moment', typescript, () => moment().valueOf())

  makeItGreen()

  dom.setStatus(GTG)
  ready()
}

check(true)
