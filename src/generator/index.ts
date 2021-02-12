import { Mapping, BasePath } from '../types';
import { writeFile, readFile } from '../utils';
import parse from '../parser';

export function file(
  target: string,
  template: string,
  mapping: Mapping = {},
  base: BasePath = '',
) {
  const templateContent = readFile(template);

  if (!templateContent) {
    throw new Error(`Template at ${template} does not exist.`);
  }

  writeFile(target, parse(templateContent, mapping));
}
