import { ParseOptions } from '../parser/types';

type InsertRegex = {
  [key: string]: string;
};

enum InsertPosition {
  ABOVE = 'above',
  BELOW = 'below',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface InsertOptions extends ParseOptions {
  template?: string;
  regex?: InsertRegex;
  position?: InsertPosition;
}
