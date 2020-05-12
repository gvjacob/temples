import Listr from 'listr';
import path from 'path';

import { boldCyan } from '../prompts';
import { readFile, writeFile, resolvePaths } from '../utils';
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
  const parsedTemplate = parse(templateFile, mapping, defaultMapping);

  writeFile(parsedOutputPath, parsedTemplate);
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
      `Invalid output path provided in a temple or its context: ${context.cmd}`
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
  console.log(`\nProcessing temples for: ${boldCyan(context.cmd)}`);
  const processes = new Listr(
    temples.map(
      (temple) => {
        const contextualizedTemple = contextualize(temple, context);
        const fileName = path.basename(contextualizedTemple.output);

        return {
          title: `Creating ${boldCyan(fileName)}`,
          task: () => handle(contextualizedTemple, mapping),
        };
      },
      { exitOnError: false }
    )
  );

  processes.run().catch((err) => console.error(err));
};

export default temples;
