declare const USE_ESM: boolean;
declare const IS_STANDALONE: boolean;
declare const PACKAGE_JSON: { name: string; version: string };
declare function REQUIRED_VERSION(version: number): number | string;
declare function REQUIRED_VERSION(version: string): string;

declare namespace NodeJS {
  export interface ProcessEnv {
    BABEL_8_BREAKING: string;
    IS_PUBLISH: string;
  }
}
