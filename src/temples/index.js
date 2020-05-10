import { readFile, writeFile, resolvePaths } from '../utils';
import parse from '../parser';

/**
 * Process temple given mapping from CLI command.
 *
 * @param {Temple} temple | temple command
 * @param {Object} mapping | key to value mapping
 */
const handle = ({ template, output, default: defaultMapping }, mapping) => {
  const templateFile = readFile(template);
  const parsedTemplate = parse(templateFile, mapping, defaultMapping);
  writeFile(parse(output, mapping, defaultMapping), parsedTemplate);
};

/**
 * Contextualizes temple with given context.
 *
 * @param {Temple} temple | temple to modify
 * @param {Context} context | command context
 *
 * @returns {Temple} contextualized temple
 */
export const contextualize = (temple, context) => {
  const templePaths = ['output', 'template'];

  try {
    return templePaths.reduce(
      (acc, p) => ({ ...acc, [p]: resolvePaths(context.base, temple[p]) }),
      temple
    );
  } catch (e) {
    throw new Error(
      `Invalid output path provided in a temple or its context: ${context.command}`
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
  temples.forEach((temple) => handle(contextualize(temple, context), mapping));
};

export default temples;
