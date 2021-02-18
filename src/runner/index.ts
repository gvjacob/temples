import { isEmpty } from 'lodash';
import path from 'path';

import { generateFile, generateInsert } from '../generator';
import { customize } from '../handlebars';
import { serializeBasePathsConfig } from '../serializers';
import { Mapping, TemplesConfig } from '../types';
import { override } from '../utils';

/**
 * Customize Handlebars instance from
 * config file path from temples config.
 *
 * @param {TemplesConfig} temples
 */
function customizeHandlebars(temples: TemplesConfig) {
  const { handlebars } = temples;

  if (handlebars) {
    customize(path.resolve(handlebars));
  }
}

/**
 * Run temples from the generator command, and mapping.
 *
 * 1. Configure Handlebars instance
 * 2. Generate files
 * 3. Generate inserts
 *
 * @param {string} generator - generator command name
 * @param {Mapping} mapping
 * @param {TemplesConfig} temples
 * @param {boolean} verbose
 */
export default function run(
  generator: string,
  mapping: Mapping,
  temples: TemplesConfig,
  verbose = false,
) {
  customizeHandlebars(temples);

  // Get config for generator command
  const { generators } = temples;
  const commandConfig = generators[generator];

  // Check that generator command exists in temples
  if (!commandConfig) {
    throw new Error(`Command ${generator} not found in temples configuration.`);
  }

  // Only run if there are files or inserts specified
  if (isEmpty(commandConfig.files) && isEmpty(commandConfig.inserts)) {
    throw new Error(`Specify files or inserts for ${generator}.`);
  }

  // Assign properties that can be overridden
  const base = override(
    serializeBasePathsConfig(temples.base),
    serializeBasePathsConfig(commandConfig.base),
  );
  const regex = override(temples.regex, commandConfig.regex);
  const position = temples.position || commandConfig.position;
  const defaultMapping = override(temples.default, commandConfig.default);
  const completeMapping = override(defaultMapping, mapping);

  // Generate files
  commandConfig.files?.forEach((file) =>
    generateFile(file.target, file.template, completeMapping, base),
  );

  // Generate inserts
  commandConfig.inserts?.forEach((insert) =>
    generateInsert(
      insert.target,
      override(regex, insert.regex),
      completeMapping,
      position || insert.position,
      base,
    ),
  );
}
