import yargs from 'yargs/yargs';
import { omit } from 'lodash';
import { Command, flags } from '@oclif/command';
import { Props } from './types';

export default class Temples extends Command {
  TEMPLES_YAML = '.temples.yaml';

  static description =
    'Automatically generate files from predefined templates. No more boilerplate.';

  static flags = {
    version: flags.version({ char: 'v' }),
    verbose: flags.boolean({ char: 'V' }),
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
    return omit(args, '_', '$0') as Props;
  }

  async run() {
    const { args } = this.parse(Temples);
    const props = this.getUserProps();
    console.log(args);
    console.log(props);
    this.log('Welcome to temples');
  }
}
