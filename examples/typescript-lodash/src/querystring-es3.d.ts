declare module 'querystring-es3' {
    function decode(qs: string, sep?: string, eq?: string, options?: any): any;
    function encode(obj: any, sep?: string, eq?: string, name?: string): string;
}
