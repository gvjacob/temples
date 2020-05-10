import path from 'path';
import yaml from 'yaml';
import { argv } from 'yargs';
import { omit, get } from 'lodash';

import { readFile } from './utils';
import handleTemples from './temples';

const TEMPLES_YAML = '.temples.yaml';

/**
 * Get absolute path to yaml file.
 *
 * @returns {String} absolute path to yaml file
 */
const getYamlPath = () => {
  return path.join(process.cwd(), TEMPLES_YAML);
};

/**
 * Get the temple commands parsed into object.
 *
 * @returns {Command[]} list of commands
 */
const getTempleCommands = () => {
  const yamlFile = readFile(getYamlPath());
  return yaml.parse(yamlFile);
};

/**
 * Get command name and template mapping.
 *
 * @returns {Object} command name and template mapping
 */
const getCommandAndMapping = () => {
  const mapping = omit(argv, '_', '$0');
  const command = argv._[0];

  return { command, mapping };
};

export default () => {
  const { command: cliCommand, mapping } = getCommandAndMapping();
  const command = get(getTempleCommands(), cliCommand);

  if (!command) {
    console.error('Command not found');
  } else {
    console.log(`Running command: ${cliCommand}`);

    const { temples, ...context } = command;
    handleTemples(temples, context, mapping);
  }
};
