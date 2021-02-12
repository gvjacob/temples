export type Mapping = {
  [key: string]: string;
};

type TargetBasePath =
  | string
  | {
      files: string;
      inserts: string;
    };

export type BasePath =
  | string
  | {
      templates: string;
      target: TargetBasePath;
    };
