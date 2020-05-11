import { Array, String, Dictionary, Record, Union, Undefined } from 'runtypes';

export const Optional = (type) => type.Or(Undefined);
export const Mapping = Dictionary(String, String);

export const Base = Union(
  String,
  Record({
    template: Optional(String),
    output: Optional(String),
  })
);

export const Context = Record({
  base: Optional(Base),
  default: Optional(Mapping),
});

export const Temple = Record({
  template: Optional(String),
  output: String,
  default: Optional(Mapping),
});

export const Temples = Array(Temple);

export const Command = Union(Record({ temples: Temples }), Context);
