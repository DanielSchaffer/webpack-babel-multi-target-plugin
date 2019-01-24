import { request } from 'https'

export class BrowserStackReporter {

  private errors: string[] = []
  private failed: boolean = false

  constructor(private session: any, private browserStackUser: string, private browserStackKey: string) {}

  public async specDone(result: any) {
    this.errors.push(...result.failedExpectations.map((exp: any) => `${result.fullName}: ${exp.message}`))
    if (result.status === 'failed') {
      this.failed = true
    }
  }

  public async suiteDone(result: any) {
    this.errors.push(...result.failedExpectations.map((exp: any) => exp.message))
    if (result.status === 'failed') {
      this.failed = true
    }
  }

  public async jasmineDone() {
    // console.log('Complete!', result, session.id_)

    await this.mark()
    // console.log('Marked')
  }

  private mark() {
    const body = { status: this.failed ? 'failed' :  'passed', reason: this.errors.join('\n') }
    const data = JSON.stringify(body)
    const options = {
      method: 'PUT',
      hostname: 'api.browserstack.com',
      path: `/automate/sessions/${this.session.id_}.json`,
      auth: `${this.browserStackUser}:${this.browserStackKey}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
    }
    return new Promise((resolve, reject) => {
      const req = request(options, (res) => {
        res.on('error', reject)
        res.on('data', (buf) => console.log('marked', res.statusCode, buf.toString()))
        res.on('end', resolve)
      })

      req.on('error', err => reject(err))
      console.log('marking', data)
      req.write(data)
      req.end()
    })
  }


}
