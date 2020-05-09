import path from 'path';

/**
 * Process temple given mapping from CLI command.
 *
 * @param {Temple} temple | temple command
 * @param {Object} mapping | key to value mapping
 */
const handle = ({ template, output, defaultMap }, mapping) => {
  return;
};

/**
 * Contextualizes temple with given context.
 *
 * @param {Temple} temple | temple to modify
 * @param {Context} context | command context
 * @returns {Temple} contextualized temple
 */
const contextualize = (temple, context) => {
  const contextualizedOutput = path.join(context.output, temple.output);
  return { ...temple, output: contextualizedOutput };
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
