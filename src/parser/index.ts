import Handlebars from '../handlebars';
import { Mapping } from '../types';
import { ParseOptions } from './types';

/**
 * Compile source with given mapping, overriding the default.
 *
 * @param {string} source - template source
 * @param {Mapping} mapping - user defined mapping
 * @param {Mapping} defaultMapping - default or fallback mapping
 *
 * @return {string} compiled output
 */
function compile(source: string, mapping: Mapping = {}, defaultMapping: Mapping = {}): string {
  const template = Handlebars.compile(source);
  return template({ ...defaultMapping, ...mapping });
}

/**
 * Parse source with mappings.
 *
 * @param {string} source - template source
 * @param {Mapping} mapping - user defined mapping
 * @param {Mapping} defaultMapping - default or fallback mapping
 * @param {ParseOptions} options - parse options
 *
 * @return {string} compiled output
 */
function parse(
  source: string,
  mapping: Mapping = {},
  defaultMapping: Mapping = {},
  options: ParseOptions = {},
): string {
  const compiled = compile(source, mapping, defaultMapping);

  // Get before and after strings if provided.
  const before = options.before || '';
  const after = options.after || '';

  return before + compiled + after;
}

export default parse;
