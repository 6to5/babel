export namespace Tags {
  export const enum TagsType {
    Unknown = 0,
    PC = 1,
    Mobile = 2,
    Console = 3,
  }
  export interface TagsCategory {
    type?: Tags.TagsType;
    title?: string;
  }
}
