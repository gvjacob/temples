import path from 'path';
import { isNull } from 'lodash';

import { RegExpConfig, Mapping, BasePath, InsertPosition } from '../types';
import { writeFile, readFile } from '../utils';
import insert from '../insert';
import parse from '../parser';

const DEFAULT_BASE_PATH: BasePath = {
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
export function generateFile(
  target: string,
  template: string,
  mapping: Mapping = {},
  base: BasePath = DEFAULT_BASE_PATH,
) {
  const templateWithBase = path.resolve(base.templates, template);
  const templateContent = readFile(templateWithBase);

  if (!templateContent) {
    throw new Error(`Template at ${templateWithBase} does not exist.`);
  }

  const parsed = parse(templateContent, mapping);
  const targetWithBase = path.resolve(base.files, target);

  writeFile(targetWithBase, parsed);
}

/**
 * Get file extension.
 *
 * @param {string} file
 *
 * @return {string}
 */
function getFileExtension(file: string): string {
  const extname = path.extname(file);
  return extname.replace('.', '');
}

/**
 * Modify target file by inserting mapping.
 *
 * @param {string} target - file to modify
 * @param {RegExpConfig} regex - extensions to regex
 * @param {Mapping} mapping
 * @param {InsertPosition} position
 * @param {BasePath} base - base paths
 */
export function generateInsert(
  target: string,
  regex: RegExpConfig,
  mapping: Mapping = {},
  position: InsertPosition = InsertPosition.BELOW,
  base: BasePath = DEFAULT_BASE_PATH,
) {
  const targetWithBase = path.resolve(base.inserts, target);
  const targetContent = readFile(targetWithBase);
  const extension = getFileExtension(target);
  const extensionRegex = regex[extension];

  if (!extensionRegex) {
    throw new Error(`Specify regex pattern for ${targetWithBase}.`);
  }

  if (isNull(targetContent)) {
    throw new Error(`Target at ${target} does not exist.`);
  }

  const targetInserted = insert(targetContent, regex.md, mapping, { position });
  writeFile(targetWithBase, targetInserted);
}
