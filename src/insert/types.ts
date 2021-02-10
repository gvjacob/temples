import { ParseOptions } from '../parser/types';

enum InsertPosition {
  ABOVE = 'above',
  BELOW = 'below',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface InsertOptions extends ParseOptions {
  template?: string;
  position?: InsertPosition;
}
