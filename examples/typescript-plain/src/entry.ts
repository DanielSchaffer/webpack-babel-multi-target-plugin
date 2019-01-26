import { GTG } from '../../_shared/constants'
import { createDom } from '../../_shared/es6-dom'
import { typescript } from '../../_shared/logos'
import { makeItGreen } from '../../_shared/make.it.green'
import ready from '../../_shared/ready'

function check(bind: boolean = false): Promise<void> {
  if (['complete', 'interactive'].includes(document.readyState)) {
    document.onreadystatechange = undefined
    return init()
  }
  if (bind) {
    document.onreadystatechange = check.bind(null, false)
  }
}

async function init(): Promise<void> {
  const dom = createDom('typescript-plain', typescript)

  makeItGreen()

  dom.setStatus(GTG)
  ready()
}

check(true)
