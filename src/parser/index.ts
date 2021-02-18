import Handlebars from '../handlebars';
import { Mapping, ParseOptions } from '../types';

/**
 * Parse source with mappings.
 *
 * @param {string} source - template source
 * @param {Mapping} mapping - user defined mapping
 *
 * @return {string} compiled output
 */
function parse(source: string, mapping: Mapping = {}): string {
  const template = Handlebars.compile(source);
  return template(mapping);
}

export default parse;
