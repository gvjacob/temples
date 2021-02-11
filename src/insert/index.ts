import { Mapping } from '../types';
import { InsertOptions } from './types';
import { findMatchedRegExp } from '../utils';

/**
 * Insert parsed output into given source.
 *
 * @param {string} source - template source
 * @param {string} regex - regex pattern for source
 * @param {Mapping} mapping - user defined mapping
 * @param {Mapping} defaultMapping - default or fallback mapping
 * @param {InsertOptions} options - insert options
 *
 * @return {string} compiled output
 */
function insert(
  source: string,
  regex: string,
  mapping: Mapping = {},
  defaultMapping: Mapping = {},
  options: InsertOptions = {},
): string {
  const matches = findMatchedRegExp(source, regex);
  return source;
}

export default insert;
