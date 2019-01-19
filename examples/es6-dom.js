function createWelcomePanel(exampleName) {
  const welcomePanel = document.createElement('div')
  welcomePanel.setAttribute('class', 'panel')

  welcomePanel.appendChild(createWelcomeTitle(exampleName))

  const status = createStatus()
  welcomePanel.appendChild(status.element)

  return {
    element: welcomePanel,
    setStatus: status.setStatus,
  }
}

function createWelcomeTitle(exampleName) {
  const welcomeTitle = document.createElement('h2')
  welcomeTitle.id = 'welcome'
  welcomeTitle.innerHTML = `Welcome to ${exampleName}!`

  welcomeTitle.appendChild(createLogo())

  return welcomeTitle
}

function createLogo() {
  const logo = document.createElement('img')
  logo.id = 'logo'
  logo.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8c3ZnIHdpZHRoPSIyNTZweCIgaGVpZ2h0PSIyNTZweCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiPgogICAgPGc+CiAgICAgICAgPHJlY3QgZmlsbD0iI0YyNjUyMiIgeD0iMCIgeT0iMCIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiPjwvcmVjdD4KICAgICAgICA8cGF0aCBkPSJNMTA1LjUzNjExNSwxNTkuOTU4OTM4IEwxNDQuNjkzMDExLDE1OS45NTg5MzggTDE0NC42OTMwMTEsMTQ5LjMwNTk1OCBMMTE3LjYyODY4NiwxNDkuMzA1OTU4IEwxMTcuNjI4Njg2LDEzMi43OTg2MzkgTDE0Mi41ODE2MSwxMzIuNzk4NjM5IEwxNDIuNTgxNjEsMTIyLjE0NTY2IEwxMTcuNjI4Njg2LDEyMi4xNDU2NiBMMTE3LjYyODY4NiwxMDYuNjk0MDQyIEwxNDQuNjkzMDExLDEwNi42OTQwNDIgTDE0NC42OTMwMTEsOTYuMDQxMDYzIEwxMDUuNTM2MTE1LDk2LjA0MTA2MyBMMTA1LjUzNjExNSwxNTkuOTU4OTM4IEwxMDUuNTM2MTE1LDE1OS45NTg5MzggWiBNMTk2Ljk5ODE3OSwxNDIuNTg3ODY0IEMxOTYuOTk4MTc5LDEyOS44MjM0ODMgMTk2LjEzNDQyNCwxMjcuMDQwMjcyIDE3OC45NTUyOTUsMTIyLjkxMzQ0MyBDMTY3LjkxODQyNSwxMjAuMjI2MjA1IDE2Ny43MjY0OCwxMjAuMDM0MjU5IDE2Ny43MjY0OCwxMTIuNzQwMzI3IEMxNjcuNzI2NDgsMTA3LjE3MzkwNiAxNjkuMTY2MDcxLDEwNS40NDYzOTYgMTc3LjMyMzc1OCwxMDUuNDQ2Mzk2IEMxODIuODkwMTgsMTA1LjQ0NjM5NiAxODkuMTI4NDExLDEwNi4yMTQxNzggMTk0LjQwNjkxNCwxMDcuMzY1ODUyIEwxOTUuNzUwNTMyLDk3LjE5MjczNjMgQzE4OS40MTYzMjksOTUuNzUzMTQ0NSAxODIuNjk4MjM0LDk1LjA4MTMzNTEgMTc3LjEzMTgxMyw5NS4wODEzMzUxIEMxNjAuOTEyNDEyLDk1LjA4MTMzNTEgMTU1LjYzMzkwOSwxMDAuODM5NzAyIDE1NS42MzM5MDksMTEyLjQ1MjQwOSBDMTU1LjYzMzkwOSwxMjUuOTg0NTcyIDE1Ny43NDUzMSwxMjguOTU5NzI4IDE3My4xOTY5MjgsMTMyLjQxNDc0OCBDMTg0LjcxMzY2MiwxMzQuOTEwMDQxIDE4NC45MDU2MDgsMTM1LjQ4NTg3OCAxODQuOTA1NjA4LDE0Mi41ODc4NjQgQzE4NC45MDU2MDgsMTQ4LjczMDEyMiAxODMuNDY2MDE2LDE1MC41NTM2MDUgMTc0LjczMjQ5MywxNTAuNTUzNjA1IEMxNjguMzk4Mjg5LDE1MC41NTM2MDUgMTYyLjYzOTkyMiwxNDkuNDAxOTMyIDE1Ni42ODk2MDksMTQ3LjU3ODQ0OCBMMTU0LjU3ODIwOCwxNTcuMDc5NzUzIEMxNTguODAxMDExLDE1OS4wOTUxODMgMTY3LjI0NjYxNSwxNjAuOTE4NjY1IDE3NC41NDA1NDcsMTYwLjkxODY2NSBDMTkzLjQ0NzE4NiwxNjAuOTE4NjY1IDE5Ni45OTgxNzksMTU0LjY4MDQzNSAxOTYuOTk4MTc5LDE0Mi41ODc4NjQgTDE5Ni45OTgxNzksMTQyLjU4Nzg2NCBMMTk2Ljk5ODE3OSwxNDIuNTg3ODY0IFogTTIxOS4yNjM4NjUsMTE4Ljc4NjYxMyBDMjE5LjI2Mzg2NSwxMDguOTk3Mzg5IDIyMy45NjY1MzEsMTA3LjA3NzkzMyAyMzUuMjkxMzIsMTA3LjA3NzkzMyBDMjM3LjMwNjc0OCwxMDcuMDc3OTMzIDI0MS41Mjk1NSwxMDcuMzY1ODUyIDI0NC4zMTI3NjEsMTA3Ljk0MTY4OCBMMjQ1LjA4MDU0NCw5OC4xNTI0NjQxIEMyNDIuMjAxMzYsOTcuNDgwNjU0NyAyMzcuNTk0NjY3LDk3LjAwMDc5MDggMjM0LjA0MzY3NCw5Ny4wMDA3OTA4IEMyMTYuNTc2NjI3LDk3LjAwMDc5MDggMjA3LjU1NTE4NSwxMDIuMzc1MjY3IDIwNy41NTUxODUsMTE5LjI2NjQ3NyBMMjA3LjU1NTE4NSwxNDIuNTg3ODY0IEMyMDcuNTU1MTg1LDE1My42MjQ3MzQgMjEwLjgxODI2LDE2MC45MTg2NjUgMjI3LjMyNTU3OSwxNjAuOTE4NjY1IEMyNDIuMzkzMzA2LDE2MC45MTg2NjUgMjQ3LDE1My40MzI3ODkgMjQ3LDE0My40NTE2MTggTDI0NywxMzguODQ0OTI1IEMyNDcsMTI3LjgwODA1NSAyNDIuMjk3MzMzLDEyMy4wMDk0MTUgMjMwLjY4NDYyNiwxMjMuMDA5NDE1IEMyMjYuNTU3Nzk3LDEyMy4wMDk0MTUgMjIyLjYyMjkxMiwxMjMuNTg1MjUyIDIxOS4yNjM4NjUsMTI0LjczNjkyNiBMMjE5LjI2Mzg2NSwxMTguNzg2NjEzIEwyMTkuMjYzODY1LDExOC43ODY2MTMgWiBNMjI4Ljg2MTE0MywxMzMuMDg2NTU4IEMyMzMuMDgzOTQ2LDEzMy4wODY1NTggMjM1LjI5MTMyLDEzNC41MjYxNDkgMjM1LjI5MTMyLDEzOS4xMzI4NDQgTDIzNS4yOTEzMiwxNDMuODM1NTEgQzIzNS4yOTEzMiwxNDguNzMwMTIyIDIzMy4zNzE4NjUsMTUwLjg0MTUyMyAyMjcuMzI1NTc5LDE1MC44NDE1MjMgQzIyMS4yNzkyOTQsMTUwLjg0MTUyMyAyMTkuMjYzODY1LDE0OS4xMTQwMTMgMjE5LjI2Mzg2NSwxNDMuODM1NTEgTDIxOS4yNjM4NjUsMTM1LjEwMTk4NyBDMjIxLjk1MTEwMiwxMzMuOTUwMzEzIDIyNS40MDYxMjMsMTMzLjA4NjU1OCAyMjguODYxMTQzLDEzMy4wODY1NTggTDIyOC44NjExNDMsMTMzLjA4NjU1OCBMMjI4Ljg2MTE0MywxMzMuMDg2NTU4IFoiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+'

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

function createClicksPanel() {
  const panel = document.createElement('div')
  panel.id = 'clicks'
  panel.setAttribute('class', 'panel')

  const header = document.createElement('h3')
  header.innerHTML = 'Clicks'
  panel.appendChild(header)

  panel.appendChild(createClicksContainer())

  return panel
}

function createClicksContainer() {
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
    click.innerHTML = `${new Date().valueOf()}: ${e.target.tagName}`
    clicks.appendChild(click)
  }

  return clicks
}

export const createDom = (exampleName) => {
  const appRoot = document.getElementsByTagName('app-root')[0]
  const welcomePanel = createWelcomePanel(exampleName)
  appRoot.appendChild(welcomePanel.element)
  appRoot.appendChild(createClicksPanel())

  return {
    setStatus: welcomePanel.setStatus,
  }
}
