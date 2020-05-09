import path from 'path';
import yaml from 'yaml';
import fs from 'fs';
import { argv } from 'yargs';
import { omit, get } from 'lodash';

import runTemples from './temples';

const TEMPLES_YAML = '.temples.yaml';

/**
 * Get the temple commands parsed into object.
 *
 * @returns {Command[]} list of commands
 */
const getTempleCommands = () => {
  const templeCommandsPath = path.join(__dirname, `../test/${TEMPLES_YAML}`);
  const yamlFile = fs.readFileSync(templeCommandsPath, 'utf-8');

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

const run = () => {
  const { command, mapping } = getCommandAndMapping();
  const commands = getTempleCommands();

  const runCommand = get(commands, command);

  if (!runCommand) {
    console.error('Command not found');
  } else {
    console.log(`Running command: ${command}`);

    const { temples, ...context } = runCommand;
    runTemples(temples, context, mapping);
  }
};

run();
