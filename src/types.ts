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

export enum InsertPosition {
  ABOVE = 'above',
  BELOW = 'below',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface InsertOptions extends ParseOptions {
  position?: InsertPosition;
}

interface GenerateFileConfig {
  base: string;
  defaultMapping: Mapping;
}

export interface ParseOptions {
  before?: string;
  after?: string;
}

export type RegExpMatch = [string, string | null];

export interface RegExpConfig {
  [key: string]: string;
}
