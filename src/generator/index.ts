import path from 'path';
import { isNull } from 'lodash';
import { cyan } from 'chalk';

import { RegExpConfig, Props, BasePath, InsertPosition } from '../types';
import { writeFile, readFile, truncate } from '../utils';
import insert from '../insert';
import parse from '../parser';
import { ListrTask } from 'listr';

const DEFAULT_BASE_PATH: BasePath = {
  templates: '',
  files: '',
  inserts: '',
};

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
 * Generate a new file from template and props.
 *
 * @param {string} target - path to output
 * @param {string} template - path to template file
 * @param {Props} props
 * @param {BasePath} base - base paths
 */
export function generateFile(
  target: string,
  template: string = '',
  props: Props = {},
  base: BasePath = DEFAULT_BASE_PATH,
) {
  const templateWithBase = path.resolve(base.templates || '', template);
  const parsedTemplateWithBase = parse(templateWithBase, props);

  if (!template) {
    writeFile(target, '');
    return;
  }

  const templateContent = readFile(parsedTemplateWithBase);

  if (!templateContent) {
    throw new Error(`Template at ${parsedTemplateWithBase} does not exist.`);
  }

  const parsed = parse(templateContent, props);

  writeFile(target, parsed);
}

/**
 * Generate a new file from template and props.
 *
 * @param {string} target - path to output
 * @param {string} template - path to template file
 * @param {Props} props
 * @param {BasePath} base - base paths
 */
export function ListrGenerateFile(
  target: string,
  template: string = '',
  props: Props = {},
  base: BasePath = DEFAULT_BASE_PATH,
): ListrTask {
  const targetWithBase = path.resolve(base.files || '', target);
  const parsedTargetWithBase = parse(targetWithBase, props);

  return {
    title: cyan(truncate(parsedTargetWithBase)),
    task: () => generateFile(parsedTargetWithBase, template, props, base),
  };
}

/**
 * Modify target file by inserting props.
 *
 * @param {string} target - file to modify
 * @param {RegExpConfig} regex - extensions to regex
 * @param {Props} props
 * @param {InsertPosition} position
 * @param {BasePath} base - base paths
 */
export function generateInsert(
  target: string,
  regex: RegExpConfig = {},
  props: Props = {},
  position: InsertPosition = 'below',
  base: BasePath = DEFAULT_BASE_PATH,
) {
  const targetContent = readFile(target);

  const extension = getFileExtension(target);
  const extensionRegex = regex[extension];

  // User did not specify regex pattern for
  // target's file extension.
  if (!extensionRegex) {
    throw new Error(`Specify regex pattern for ${target}.`);
  }

  if (isNull(targetContent)) {
    throw new Error(`Target at ${target} does not exist.`);
  }

  const targetInserted = insert(targetContent, extensionRegex, props, {
    position,
  });

  writeFile(target, targetInserted);
}

/**
 * Modify target file by inserting props.
 *
 * @param {string} target - file to modify
 * @param {RegExpConfig} regex - extensions to regex
 * @param {Props} props
 * @param {InsertPosition} position
 * @param {BasePath} base - base paths
 */
export function ListrGenerateInsert(
  target: string,
  regex: RegExpConfig = {},
  props: Props = {},
  position: InsertPosition = 'below',
  base: BasePath = DEFAULT_BASE_PATH,
): ListrTask {
  const targetWithBase = path.resolve(base.inserts || '', target);
  const parsedTargetWithBase = parse(targetWithBase, props);

  return {
    title: cyan(truncate(parsedTargetWithBase)),
    task: () =>
      generateInsert(parsedTargetWithBase, regex, props, position, base),
  };
}
