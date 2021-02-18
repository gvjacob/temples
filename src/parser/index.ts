import Handlebars from '../handlebars';
import { Props, ParseOptions } from '../types';

/**
 * Parse source with props.
 *
 * @param {string} source - template source
 * @param {Props} props - user defined props
 *
 * @return {string} compiled output
 */
function parse(source: string, props: Props = {}): string {
  const template = Handlebars.compile(source);
  return template(props);
}

export default parse;
