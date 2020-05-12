import path from 'path';
import yaml from 'yaml';
import { argv } from 'yargs';
import { omit, get, isEmpty } from 'lodash';

import handleTemples from './temples';
import { readFile } from './utils';
import { Command } from './types';
import { promptCommand, promptMapping } from './prompts';

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
 * Get command from yaml and CLI template mapping. If command or
 * mapping is not specified, run an enquirer prompt.
 *
 * @returns {Object} command object and template mapping
 */
const getCommandAndMapping = async () => {
  const {
    command: cliCommand,
    mapping: cliMapping,
  } = getCliCommandAndMapping();
  const commands = getTempleCommands();

  const cmd =
    cliCommand || cliCommand || (await promptCommand(Object.keys(commands)));
  const command = get(commands, cmd);

  const mapping = isEmpty(cliMapping)
    ? await promptMapping(cmd, command.prompt)
    : cliMapping;

  return { cmd, command, mapping };
};

export default async () => {
  const { cmd, command, mapping } = await getCommandAndMapping();
  const isValid = Command.guard(command);

  if (isEmpty(command)) {
    console.error('\nCommand not found');
  } else if (!isValid) {
    console.error(`\nConfiguration is invalid`);
  } else {
    const { temples, ...context } = command;
    handleTemples(temples, { ...context, cmd }, mapping);
  }
};
