import Handlebars from '../handlebars';
import { ParseOptions } from './types';

/**
 * Compile source with given mapping, overriding the default.
 *
 * @param {string} source - template source
 * @param {object} mapping - user defined mapping
 * @param {object} defaultMapping - default or fallback mapping
 *
 * @return {string} compiled output
 */
function compile(source: string, mapping = {}, defaultMapping = {}): string {
  const template = Handlebars.compile(source);
  return template({ ...defaultMapping, ...mapping });
}

/**
 * Parse source with mappings.
 *
 * @param {string} source - template source
 * @param {object} mapping - user defined mapping
 * @param {object} defaultMapping - default or fallback mapping
 * @param {object} options - extra options
 *
 * @return {string} compiled output
 */
function parse(source: string, mapping = {}, defaultMapping = {}, options: ParseOptions = {}): string {
  const compiled = compile(source, mapping, defaultMapping);

  // Get before and after strings if provided.
  const before = options.before || '';
  const after = options.after || '';

  return before + compiled + after;
}

export default parse;
