import path from 'path';
import { get, isString } from 'lodash';

import { boldCyan, notifyProcesses } from '../prompts';
import { readFile, writeFile, resolvePaths, getParentAndFile } from '../utils';
import parse from '../parser';

/**
 * Process temple given mapping from CLI command.
 *
 * @param {Temple} temple | temple command
 * @param {Object} mapping | key to value mapping
 */
const handle = ({ template, output, default: defaultMapping }, mapping) => {
  const [parsedTemplatePath, parsedOutputPath] = [
    template,
    output,
  ].map((path) => parse(path, mapping, defaultMapping));

  const templateFile = readFile(parsedTemplatePath);
  const parsedTemplate = templateFile
    ? parse(templateFile, mapping, defaultMapping)
    : '';

  writeFile(parsedOutputPath, parsedTemplate);
};

/**
 * Get directory base for given path type, given base from context.
 *
 * @param {String} path | type of path (e.g. template, output)
 * @param {Object | String} base | base from context
 *
 * @returns {String} directory base
 */
const getPathBase = (pathType, base) => {
  return isString(base) ? base : get(base, pathType);
};

/**
 * Contextualizes temple with given context.
 *
 * @param {Temple} temple | temple to modify
 * @param {Context} context | command context
 *
 * @returns {Temple} contextualized temple
 */
export const contextualize = (temple, context, mapping = {}) => {
  const templePaths = ['output', 'template'];

  try {
    return templePaths.reduce(
      (acc, p) => ({
        ...acc,
        [p]: parse(
          resolvePaths(getPathBase(p, context.base), temple[p]),
          mapping,
        ),
      }),
      temple,
    );
  } catch (e) {
    throw new Error(
      `Invalid output path provided in a temple or its context: ${context.cmd}`,
    );
  }
};

/**
 * Process all temples given CLI command configuration
 * and mapping.
 *
 * @param {Temple[]} temples | temples
 * @param {Context} context | command context
 * @param {Object} mapping | key to value mapping
 */
const temples = (temples, context, mapping) => {
  notifyProcesses(
    `\nProcessing temples for: ${boldCyan(context.cmd)}`,
    temples.map((temple) => {
      const contextualizedTemple = contextualize(temple, context, mapping);
      const parentAndFile = getParentAndFile(contextualizedTemple.output);

      return {
        title: `Created ${boldCyan(parentAndFile)}`,
        task: () => handle(contextualizedTemple, mapping),
      };
    }),
  );
};

export default temples;
