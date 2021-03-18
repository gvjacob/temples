import { isEmpty } from 'lodash';
import path from 'path';
import { cyan } from 'chalk';

import { logProcesses } from './cli';
import { ListrGenerateFile, ListrGenerateInsert } from './generator';
import { customize } from './handlebars';
import { serializeBasePathsConfig } from './serializers';
import { Props, TemplesConfig } from './types';
import { override } from './utils';

/**
 * Customize Handlebars instance from
 * config file path from temples config.
 *
 * @param {TemplesConfig} temples
 */
async function customizeHandlebars(temples: TemplesConfig) {
  const { handlebars } = temples;

  if (handlebars) {
    await customize(path.resolve(handlebars));
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
export default async function run(
  generator: string,
  props: Props,
  temples: TemplesConfig,
  verbose: boolean = false,
) {
  await customizeHandlebars(temples);

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

  const { files, inserts } = generatorConfig;

  // Generate files
  if (files) {
    await logProcesses(
      `\nGenerating ${cyan(files.length)} file(s)`,
      files.map((file) =>
        ListrGenerateFile(file.target, file.template, completeProps, base),
      ),
    );
  }

  if (inserts) {
    await logProcesses(
      `\nInserting into ${cyan(inserts.length)} file(s)`,
      inserts.map((insert) =>
        ListrGenerateInsert(
          insert.target,
          override(regex, insert.regex),
          completeProps,
          position || insert.position,
          base,
        ),
      ),
    );
  }
}
