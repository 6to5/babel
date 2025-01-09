export const enum ACTIONS {
  GET_DEFAULT_EXTENSIONS = "GET_DEFAULT_EXTENSIONS",
  SET_OPTIONS = "SET_OPTIONS",
  TRANSFORM = "TRANSFORM",
  TRANSFORM_SYNC = "TRANSFORM_SYNC",
}

export type Options = {
  extensions?: string[];
};

export interface IClient {
  getDefaultExtensions(): string[];
  setOptions(options: Options): void;
  transform(
    code: string,
    filename: string,
  ): { code: string; map: object } | null;
}
