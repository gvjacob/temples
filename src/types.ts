import {
  Static,
  Boolean,
  Record,
  Undefined,
  Dictionary,
  String,
  Array,
  Union,
  Literal,
} from 'runtypes';

const Props = Dictionary(String, 'string');

const TargetBasePathConfig = String.Or(
  Record({
    files: String.Or(Undefined),
    inserts: String.Or(Undefined),
  }),
);

const BasePathConfig = String.Or(
  Record({
    templates: String.Or(Undefined),
    target: TargetBasePathConfig,
  }),
);

export type BasePath = {
  templates?: string;
  files?: string;
  inserts?: string;
};

const InsertPosition = Union(
  Literal('above'),
  Literal('below'),
  Literal('left'),
  Literal('right'),
);

export interface InsertOptions {
  position?: string;
}

const GenerateFileConfig = Record({
  base: String,
  defaultProps: Props,
});

export type RegExpMatch = [string, string | null];

const RegExpConfig = Dictionary(String, 'string');

const InsertsConfig = Record({
  regex: RegExpConfig.Or(Undefined),
  position: InsertPosition.Or(Undefined),
});

const GeneratorFileConfig = Record({
  template: String.Or(Undefined),
  target: String,
});

const GeneratorInsertConfig = Union(
  InsertsConfig,
  Record({
    target: String,
  }),
);

const GeneratorCommandConfig = Union(
  InsertsConfig,
  Record({
    base: BasePathConfig.Or(Undefined),
    prompt: Array(String).Or(Undefined),
    default: Props.Or(Undefined),
    files: Array(GeneratorFileConfig).Or(Undefined),
    inserts: Array(GeneratorInsertConfig).Or(Undefined),
  }),
);

export const TemplesConfig = Union(
  InsertsConfig,
  Record({
    base: BasePathConfig.Or(Undefined),
    handlebars: String.Or(Undefined),
    default: Props.Or(Undefined),
    verbose: Boolean.Or(Undefined),
    generators: Dictionary(GeneratorCommandConfig, 'string'),
  }),
);

export type TemplesConfig = Static<typeof TemplesConfig>;
export type Props = Static<typeof Props>;
export type TargetBasePathConfig = Static<typeof TargetBasePathConfig>;
export type GeneratorCommandConfig = Static<typeof GeneratorCommandConfig>;
export type GeneratorInsertConfig = Static<typeof GeneratorInsertConfig>;
export type GeneratorFileConfig = Static<typeof GeneratorFileConfig>;
export type InsertsConfig = Static<typeof InsertsConfig>;
export type RegExpConfig = Static<typeof RegExpConfig>;
export type BasePathConfig = Static<typeof BasePathConfig>;
export type InsertPosition = Static<typeof InsertPosition>;
export type GenerateFileConfig = Static<typeof GenerateFileConfig>;
