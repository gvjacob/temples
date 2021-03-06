import path from 'path';
import YAML from 'yaml';
import yargs from 'yargs/yargs';
import { isEmpty, omit } from 'lodash';
import { Command, flags } from '@oclif/command';

import { promptGeneratorCommand, promptProps } from './cli';
import { readFile } from './utils';
import { Props, TemplesConfig } from './types';
import run from './runner';

const TEMPLES_YAML = '.temples.yaml';

export default class Temples extends Command {
  static description =
    'Automatically generate code from predefined templates. No more boilerplate.';

  static flags = {
    version: flags.version({ char: 'v' }),
    verbose: flags.boolean({ char: 'V', default: false }),
    config: flags.string({ char: 'c', default: TEMPLES_YAML }),
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'generator' }];

  static usage = '[generator] --[prop]=[value] ...';

  static examples = [
    '$ temples',
    '$ temples component --name=Button --directory=containers',
  ];

  /**
   * Set to false to manually parse
   * user's variable arguments
   *
   * Parsing unspecified flags is currently not
   * supported by oclif.
   */
  static strict = false;

  /**
   * Get user props.
   *
   * @return {Props}
   */
  getUserProps(): Props {
    const args = yargs(process.argv).argv;
    const flags = Object.keys(Temples.flags);

    return omit(args, '_', '$0', ...flags) as Props;
  }

  /**
   * Get temples configuration from yaml file.
   *
   * @param {string} p - path to config file
   *
   * @return {TemplesConfig}
   */
  getTemplesConfig(p: string): TemplesConfig {
    const templesConfigFile = readFile(path.resolve(process.cwd(), p));

    if (!templesConfigFile) {
      this.error(
        'Configuration file not found or is empty. Create a .temples.yaml file.',
      );
    }

    const templesConfig = YAML.parse(templesConfigFile);

    try {
      TemplesConfig.check(templesConfig);
      return templesConfig;
    } catch (e) {
      this.error(`Configuration file is invalid.\n\n${e}`);
    }
  }

  /**
   * Run temples CLI guide.
   *
   * @param {TemplesConfig} temples
   * @param {boolean} verbose
   */
  async cli(temples: TemplesConfig, verbose: boolean) {
    const { generators } = temples;
    const generator = await promptGeneratorCommand(generators);

    const { props: propsToPrompt, default: defaultProps } = temples.generators[
      generator
    ];
    const props = propsToPrompt
      ? await promptProps(generator, propsToPrompt, defaultProps)
      : {};

    await run(generator, props, temples, verbose);
  }

  /**
   * Primary runner for temples. This will parse user
   * CLI input, pull the config file, and run the CLI
   * guide if no generator comamnd is provided.
   */
  async run() {
    const { args, flags } = this.parse(Temples);
    const { generator } = args;

    const temples = this.getTemplesConfig(flags.config);
    const props = this.getUserProps();

    if (generator) {
      await run(generator, props, temples, flags.verbose);
    } else {
      this.cli(temples, flags.verbose);
    }
  }
}
