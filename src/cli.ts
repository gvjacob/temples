import { Command, flags } from '@oclif/command';

export default class Temples extends Command {
  static description =
    'Automatically generate files from predefined templates. No more boilerplate.';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'generator' }];

  async run() {
    const { args, flags } = this.parse(Temples);
    this.log('Welcome to temples');
  }
}
