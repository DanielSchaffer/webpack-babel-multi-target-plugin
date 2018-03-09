export enum BrowserProfile {
    legacy = 'legacy',
    modern = 'modern',
}

export type BrowserProfiles = { [profile in keyof typeof BrowserProfile]?: string[] };
