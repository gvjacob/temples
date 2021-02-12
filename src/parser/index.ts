import Handlebars from '../handlebars';
import { Mapping } from '../types';
import { ParseOptions } from './types';

/**
 * Compile source with given mapping.
 *
 * @param {string} source - template source
 * @param {Mapping} mapping - user defined mapping
 *
 * @return {string} compiled output
 */
function compile(source: string, mapping: Mapping = {}): string {
  const template = Handlebars.compile(source);
  return template(mapping);
}

/**
 * Parse source with mappings.
 *
 * @param {string} source - template source
 * @param {Mapping} mapping - user defined mapping
 * @param {ParseOptions} options - parse options
 *
 * @return {string} compiled output
 */
function parse(
  source: string,
  mapping: Mapping = {},
  options: ParseOptions = {},
): string {
  const compiled = compile(source, mapping);

  // Get before and after strings if provided.
  const before = options.before || '';
  const after = options.after || '';

  return before + compiled + after;
}

export default parse;
