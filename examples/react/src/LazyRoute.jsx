import React from 'react'

import { react as reactLogo } from '../../_shared/logos'
import { makeItGreen } from '../../_shared/make.it.green'

export default (props) => {
  makeItGreen()
  const clickItems = props.clicks.map(e => (<div className="click" key={`${e.ts}:${e.target}`}>{e.ts}: {e.target}</div>))
  if (!clickItems.length) {
    clickItems.push(<div key={"empty"}>No clicks yet</div>)
  }
  return (
    <div>
      <div className="panel">
        <h2 id="welcome">
          Welcome to react!
          <img id="logo" src={'data:image/svg+xml;base64,' + reactLogo} alt="react logo" />
        </h2>

        <div id="status">
          <label>Status:</label>
          <span className="message">good to go!</span>
        </div>

      </div>

      <div id="clicks" className="panel">
        <h3>Clicks</h3>
        <div className="clicks">
          {clickItems}
        </div>
      </div>
    </div>
  )
}
