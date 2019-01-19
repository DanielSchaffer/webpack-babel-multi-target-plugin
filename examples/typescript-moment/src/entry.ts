import { createDom } from '../../_shared/es6-dom'
import { typescript } from '../../_shared/logos'
import { makeItGreen } from '../../_shared/make.it.green'

// moment doesn't play terribly nicely when it comes to es module ... this seems to make it work
import * as momentImported from 'moment';
const moment = momentImported;

function check(bind: boolean = false) {
  if (['complete', 'interactive'].includes(document.readyState)) {
    return init()
  }
  if (bind) {
    document.onreadystatechange = () => check.bind(null, false)
  }
}

async function init() {
  const dom = createDom('typescript-moment', typescript, () => moment().valueOf())

  makeItGreen()

  dom.setStatus('good to go!')
}

check(true)
