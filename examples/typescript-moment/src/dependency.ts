import * as momentImported from 'moment';
const moment = momentImported;

export class Dependency {

    public log(...args: any[]): () => void {
        let ts = moment();
        return () => console.log(ts.toString(), `(${ts.fromNow()})`, ...args);
    }

}