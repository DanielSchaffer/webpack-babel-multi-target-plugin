export class Dependency {

    public log(...args: any[]): () => void {
        return () => console.log(...args);
    }

}