import { Mapping } from '../types';
import { InsertOptions } from './types';

/**
 * Insert parsed output into given source.
 *
 * @param {string} source - template source
 * @param {object} mapping - user defined mapping
 * @param {object} defaultMapping - default or fallback mapping
 * @param {ParseOptions} options - parse options
 *
 * @return {string} compiled output
 */
function insert(
  source: string,
  mapping: Mapping = {},
  defaultMapping: Mapping = {},
  options: InsertOptions = {},
): string {
  return source;
}

export default insert;
