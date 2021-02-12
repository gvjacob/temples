export type Mapping = {
  [key: string]: string;
};

type TargetBasePathConfig =
  | string
  | {
      files: string;
      inserts: string;
    };

export type BasePathConfig =
  | string
  | {
      templates: string;
      target: TargetBasePathConfig;
    };

export interface BasePath {
  templates: string;
  files: string;
  inserts: string;
}
