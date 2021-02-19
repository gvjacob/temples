import Listr, { ListrTask } from 'listr';
import { Props, PromptConfig } from './types';
import { bold, dim } from 'chalk';
import { isString } from './utils';

/**
 * Enquirer's support for Typescript is poor.
 *
 * Somehow commonJS require works but import from
 * does not.
 */
const { Select, Input } = require('enquirer');

/**
 * Prompt for generator command.
 *
 * @param {string[]} generators - list of available generators
 *
 * @return {string} chosen generator
 */
export async function promptGeneratorCommand<T>(
  generators: string[],
): Promise<string> {
  const prompt = new Select({
    name: 'generator',
    message: 'Select generator to run:',
    choices: generators,
  });

  return await prompt.run();
}

/**
 * Prompt for props' values.
 *
 * @param {string} generator - generator for props
 * @param {PromptConfig[]} prompts - list of prompted props
 *
 * @return {Props} props key value mapping
 */
export async function promptProps(
  generator: string,
  prompts: PromptConfig[],
  defaultProps: Props = {},
): Promise<Props> {
  const props: Props = {};

  for (const p of prompts) {
    const name = isString(p) ? p : p.name;
    const doc = isString(p) ? null : p.doc;
    const message = doc ? `${bold(name)}: ${dim(doc)}` : bold(name);

    const input = new Input({
      message,
      initial: defaultProps[name],
    });

    const value = await input.run();
    props[name] = value;
  }

  return props;
}

/**
 * Run and notify given Listr processes.
 *
 * @param {string} title - title for set of processes
 * @param {ListrTask[]} processes - Listr processes to run
 * @param {object} options - Listr options
 */
export async function logProcesses(
  title: string,
  processes: ListrTask[],
  options = { exitOnError: false },
) {
  console.log(title);

  try {
    await new Listr(processes, options).run();
  } catch (e) {
    console.error(e);
  }
}
