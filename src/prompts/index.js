import { isEmpty } from 'lodash';
import { Select, Input } from 'enquirer';

/**
 * Prompt for command name.
 *
 * @param {String[]} commands | list of available commands
 *
 * @returns {String} chosen command
 */
export const promptCommand = async (commands) => {
  const prompt = new Select({
    name: 'command',
    message: 'Select command to run',
    choices: commands,
  });

  const answer = await prompt.run();
  return answer;
};

/**
 * Prompt for the value for each key.
 *
 * @params {String[]} keys | list of keys
 *
 * @returns {Object} key to value mapping
 */
export const promptMapping = async (keys = []) => {
  if (isEmpty(keys)) {
    return {};
  }

  console.log('Fill in the value for each key');
  let mapping = {};

  for (const key of keys) {
    const prompt = new Input({
      message: key,
      initial: 'value',
    });

    const value = await prompt.run();
    mapping = { ...mapping, [key]: value };
  }

  return mapping;
};
