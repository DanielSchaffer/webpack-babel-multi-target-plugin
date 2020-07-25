import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'

const OtherComponent = React.lazy(() => import('./LazyRoute'))

class Application extends React.Component {

  constructor(props) {
    super(props)

    this.state = { clicks: [] }
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener('click', this.onClick);
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.onClick);
  }
  onClick(e) {

    const clicks = this.state.clicks.concat([{ ts: Date.now(), target: e.target.tagName }])
    this.setState({ clicks })
  }

  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          <OtherComponent clicks={this.state.clicks}/>
        </div>
      </Suspense>
    )
  }

}

ReactDOM.render(
  <Application />,
  document.getElementsByTagName('app-root')[0]
)
