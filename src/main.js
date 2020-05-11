import path from 'path';
import yaml from 'yaml';
import { argv } from 'yargs';
import { omit, get, isEmpty } from 'lodash';

import handleTemples from './temples';
import { readFile } from './utils';
import { Command } from './types';
import { promptCommand } from './prompts';

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
 * Get CLI command name and template mapping.
 *
 * @returns {Object} command name and template mapping
 */
const getCliCommandAndMapping = () => {
  const mapping = omit(argv, '_', '$0');
  const command = argv._[0];

  return { command, mapping };
};

/**
 * Get command from yaml and CLI template mapping. If command is not
 * specified, run an enquirer prompt.
 *
 * @returns {Object} command object and template mapping
 */
const getCommandAndMapping = async () => {
  const { command: cliCommand, mapping } = getCliCommandAndMapping();
  const commands = getTempleCommands();

  const command = get(
    commands,
    cliCommand || (await promptCommand(Object.keys(commands)))
  );

  return { command, mapping };
};

export default async () => {
  const { command, mapping } = await getCommandAndMapping();
  const isValid = Command.guard(command);

  if (isEmpty(command)) {
    console.error('Command not found');
  } else if (!isValid) {
    console.error(`Configuration is invalid`);
  } else {
    const { temples, ...context } = command;
    handleTemples(temples, context, mapping);
  }
};
