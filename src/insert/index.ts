import { Mapping } from '../types';
import { InsertOptions } from './types';

import { findMatchedRegExp } from '../utils';
import { RegExpMatch } from '../utils/types';

import parse from '../parser';

/**
 * Replace given match in source with
 * parsed output.
 *
 * @param {string} source
 * @param {RegExpMatch} regexMatch
 * @param {InsertOptions} options
 *
 * @return {string}
 */
function replaceWithParse(
  source: string,
  regexMatch: RegExpMatch,
  mapping: Mapping = {},
  defaultMapping: Mapping = {},
  options: InsertOptions = {},
): string {
  const [match, group] = regexMatch;

  if (!group) {
    return source;
  }

  const parsed = parse(group, mapping, defaultMapping, options);
  const output = `${match}\n${parsed}`;

  return source.replace(match, output);
}

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

  const output = matches.reduce(
    (acc, match) =>
      replaceWithParse(acc, match, mapping, defaultMapping, options),
    source,
  );

  return output;
}

export default insert;
