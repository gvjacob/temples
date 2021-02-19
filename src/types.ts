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

const InsertPosition = Union(
  Literal('above'),
  Literal('below'),
  Literal('left'),
  Literal('right'),
);

const GenerateFileConfig = Record({
  base: String,
  defaultProps: Props,
});

const RegExpConfig = Dictionary(String, 'string');

const InsertsConfig = Record({
  regex: RegExpConfig.Or(Undefined),
  position: InsertPosition.Or(Undefined),
});

const PromptConfig = String.Or(
  Record({
    name: String,
    doc: String.Or(Undefined),
  }),
);

const GeneratorFileConfig = Record({
  template: String.Or(Undefined),
  target: String,
});

const GeneratorInsertConfig = Record({
  target: String,
}).And(InsertsConfig);

const GeneratorCommandConfig = Record({
  base: BasePathConfig.Or(Undefined),
  prompt: Array(PromptConfig).Or(Undefined),
  default: Props.Or(Undefined),
  files: Array(GeneratorFileConfig).Or(Undefined),
  inserts: Array(GeneratorInsertConfig).Or(Undefined),
}).And(InsertsConfig);

export const TemplesConfig = Record({
  base: BasePathConfig.Or(Undefined),
  handlebars: String.Or(Undefined),
  default: Props.Or(Undefined),
  verbose: Boolean.Or(Undefined),
  generators: Dictionary(GeneratorCommandConfig, 'string'),
}).And(InsertsConfig);

export interface InsertOptions {
  position?: string;
}

export type BasePath = {
  templates?: string;
  files?: string;
  inserts?: string;
};

export type RegExpMatch = [string, string | null];

export type TemplesConfig = Static<typeof TemplesConfig>;
export type Props = Static<typeof Props>;
export type TargetBasePathConfig = Static<typeof TargetBasePathConfig>;
export type PromptConfig = Static<typeof PromptConfig>;
export type GeneratorCommandConfig = Static<typeof GeneratorCommandConfig>;
export type GeneratorInsertConfig = Static<typeof GeneratorInsertConfig>;
export type GeneratorFileConfig = Static<typeof GeneratorFileConfig>;
export type InsertsConfig = Static<typeof InsertsConfig>;
export type RegExpConfig = Static<typeof RegExpConfig>;
export type BasePathConfig = Static<typeof BasePathConfig>;
export type InsertPosition = Static<typeof InsertPosition>;
export type GenerateFileConfig = Static<typeof GenerateFileConfig>;
