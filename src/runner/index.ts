import { isEmpty } from 'lodash';
import path from 'path';

import { generateFile, generateInsert } from '../generator';
import { customize } from '../handlebars';
import { serializeBasePathsConfig } from '../serializers';
import { Props, TemplesConfig } from '../types';
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
 * Run temples from the generator command, and props.
 *
 * 1. Configure Handlebars instance
 * 2. Generate files
 * 3. Generate inserts
 *
 * @param {string} generator - generator command name
 * @param {Props} props
 * @param {TemplesConfig} temples
 * @param {boolean} verbose
 */
export default function run(
  generator: string,
  props: Props,
  temples: TemplesConfig,
  verbose = false,
) {
  customizeHandlebars(temples);

  // Get config for generator command
  const { generators } = temples;
  const generatorConfig = generators[generator];

  // Check that generator command exists in temples
  if (!generatorConfig) {
    throw new Error(`Command ${generator} not found in temples configuration.`);
  }

  // Only run if there are files or inserts specified
  if (isEmpty(generatorConfig.files) && isEmpty(generatorConfig.inserts)) {
    throw new Error(`Specify files or inserts for ${generator}.`);
  }

  // Assign properties that can be overridden
  const base = override(
    serializeBasePathsConfig(temples.base),
    serializeBasePathsConfig(generatorConfig.base),
  );
  const regex = override(temples.regex, generatorConfig.regex);
  const position = temples.position || generatorConfig.position;
  const defaultProps = override(temples.default, generatorConfig.default);
  const completeProps = override(defaultProps, props);

  // Generate files
  generatorConfig.files?.forEach((file) =>
    generateFile(file.target, file.template, completeProps, base),
  );

  // Generate inserts
  generatorConfig.inserts?.forEach((insert) =>
    generateInsert(
      insert.target,
      override(regex, insert.regex),
      completeProps,
      position || insert.position,
      base,
    ),
  );
}
