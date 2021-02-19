import path from 'path';
import YAML from 'yaml';
import yargs from 'yargs/yargs';
import { omit } from 'lodash';
import { Command, flags } from '@oclif/command';

import { readFile } from './utils';
import { Props, TemplesConfig } from './types';
import run from './runner';

export default class Temples extends Command {
  TEMPLES_YAML = '.temples.yaml';

  static description =
    'Automatically generate files from predefined templates. No more boilerplate.';

  static flags = {
    version: flags.version({ char: 'v' }),
    verbose: flags.boolean({ char: 'V', default: false }),
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'generator' }];

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
   * @return {TemplesConfig}
   */
  getTemplesConfig(): TemplesConfig {
    const templesConfigFile = readFile(
      path.resolve(process.cwd(), this.TEMPLES_YAML),
    );

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

  async run() {
    const { args, flags } = this.parse(Temples);
    const { generator } = args;
    const props = this.getUserProps();
    const temples = this.getTemplesConfig();

    if (generator) {
      run(generator, props, temples, flags.verbose);
    }
  }
}
