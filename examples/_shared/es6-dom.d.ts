export interface CreateDomResult {
  setStatus(text: string): void
}

export function createDom(exampleName: string, logoData: string, nowFn?: () => number): CreateDomResult
