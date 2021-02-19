import {
  Static,
  Boolean,
  Record,
  Dictionary,
  String,
  Array,
  Union,
  Literal,
  Partial,
} from 'runtypes';

const Props = Dictionary(String, 'string');

const TargetBasePathConfig = String.Or(
  Partial({
    files: String,
    inserts: String,
  }),
);

const BasePathConfig = String.Or(
  Record({
    target: TargetBasePathConfig,
  }).And(
    Partial({
      templates: String,
    }),
  ),
);

const InsertPosition = Union(
  Literal('above'),
  Literal('below'),
  Literal('left'),
  Literal('right'),
);

const RegExpConfig = Dictionary(String, 'string');

const InsertsConfig = Partial({
  regex: RegExpConfig,
  position: InsertPosition,
});

const PromptConfig = String.Or(
  Record({
    name: String,
  }).And(
    Partial({
      doc: String,
    }),
  ),
);

const GeneratorFileConfig = Record({
  target: String,
}).And(
  Partial({
    template: String,
  }),
);

const GeneratorInsertConfig = Record({
  target: String,
}).And(InsertsConfig);

const GeneratorCommandConfig = Partial({
  base: BasePathConfig,
  props: Array(PromptConfig),
  default: Props,
  files: Array(GeneratorFileConfig),
  inserts: Array(GeneratorInsertConfig),
}).And(InsertsConfig);

export const TemplesConfig = Record({
  generators: Dictionary(GeneratorCommandConfig, 'string'),
}).And(
  Partial({
    base: BasePathConfig,
    handlebars: String,
    default: Props,
    verbose: Boolean,
  }).And(InsertsConfig),
);

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
