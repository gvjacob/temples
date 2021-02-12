import path from 'path';
import { get } from 'lodash';

import { Mapping, BasePath } from '../types';
import { writeFile, readFile } from '../utils';
import parse from '../parser';

const defaultBasePath: BasePath = {
  templates: '',
  files: '',
  inserts: '',
};

/**
 * Generate a new file from template and mapping.
 *
 * @param {string} target - path to output
 * @param {string} template - path to template file
 * @param {Mapping} mapping
 * @param {BasePath} base - base paths
 */
export function file(
  target: string,
  template: string,
  mapping: Mapping = {},
  base: BasePath = defaultBasePath,
) {
  const templateWithBase = path.resolve(base.templates, template);
  const templateContent = readFile(templateWithBase);

  if (!templateContent) {
    throw new Error(`Template at ${template} does not exist.`);
  }

  const parsed = parse(templateContent, mapping);
  const targetWithBase = path.resolve(base.files, target);

  writeFile(targetWithBase, parsed);
}
