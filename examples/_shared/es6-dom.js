function createWelcomePanel(exampleName, logoData) {
  const welcomePanel = document.createElement('div')
  welcomePanel.setAttribute('class', 'panel')

  welcomePanel.appendChild(createWelcomeTitle(exampleName, logoData))

  const status = createStatus()
  welcomePanel.appendChild(status.element)

  return {
    element: welcomePanel,
    setStatus: status.setStatus,
  }
}

function createWelcomeTitle(exampleName, logoData) {
  const welcomeTitle = document.createElement('h2')
  welcomeTitle.id = 'welcome'
  welcomeTitle.innerHTML = `Welcome to ${exampleName}!`

  welcomeTitle.appendChild(createLogo(logoData))

  return welcomeTitle
}

function createLogo(logoData) {
  const logo = document.createElement('img')
  logo.id = 'logo'
  logo.src = `data:image/svg+xml;base64,${logoData}`

  return logo
}

function createStatus() {
  const status = document.createElement('div')
  status.id = 'status'

  const label = document.createElement('label')
  label.innerHTML = 'Status:'
  status.appendChild(label)

  const message = document.createElement('message')
  message.setAttribute('class', 'message')
  status.appendChild(message)

  const setStatus = (text) => message.innerHTML = text

  return {
    element: status,
    setStatus,
  }
}

function createClicksPanel(nowFn) {
  const panel = document.createElement('div')
  panel.id = 'clicks'
  panel.setAttribute('class', 'panel')

  const header = document.createElement('h3')
  header.innerHTML = 'Clicks'
  panel.appendChild(header)

  panel.appendChild(createClicksContainer(nowFn))

  return panel
}

function createClicksContainer(nowFn) {
  const clicks = document.createElement('clicks')

  let noclicks = document.createElement('div')
  noclicks.innerHTML = 'No clicks yet'
  clicks.appendChild(noclicks)

  document.body.onmousedown = (e) => {
    if (noclicks) {
      clicks.removeChild(noclicks)
      noclicks = null
    }
    const click = document.createElement('div')
    click.setAttribute('class', 'click')
    click.innerHTML = `${nowFn()}: ${e.target.tagName}`
    clicks.appendChild(click)
  }

  return clicks
}

export const createDom = (exampleName, logoData, nowFn = () => new Date().valueOf()) => {
  const appRoot = document.getElementsByTagName('app-root')[0]
  const welcomePanel = createWelcomePanel(exampleName, logoData)
  appRoot.appendChild(welcomePanel.element)
  appRoot.appendChild(createClicksPanel(nowFn))

  return {
    setStatus: welcomePanel.setStatus,
  }
}
