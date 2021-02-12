import { Mapping } from '../types';
import { InsertOptions, InsertPosition } from './types';

import { findMatchedRegExp } from '../utils';
import { RegExpMatch } from '../utils/types';

import parse from '../parser';

/**
 * Place str in the right position relative to.
 *
 * @param {string} to - string relative to
 * @param {string} str - string to place
 * @param {InsertPosition} position - relative position
 *
 * @return {string}
 */
function placeRelativeTo(
  to: string,
  str: string,
  position: InsertPosition = InsertPosition.BELOW,
) {
  switch (position) {
    case InsertPosition.ABOVE:
      return `${str}\n${to}`;

    case InsertPosition.LEFT:
      return `${str}${to}`;

    case InsertPosition.RIGHT:
      return `${to}${str}`;

    default:
      return `${to}\n${str}`;
  }
}

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
function parseAndReplace(
  source: string,
  regexMatch: RegExpMatch,
  mapping: Mapping = {},
  options: InsertOptions = {},
): string {
  const [match, group] = regexMatch;

  if (!group) {
    return source;
  }

  const parsed = parse(group, mapping, options);
  const output = placeRelativeTo(match, parsed, options.position);

  return source.replace(match, output);
}

/**
 * Insert parsed output into given source.
 *
 * @param {string} source - template source
 * @param {string} regex - regex pattern for source
 * @param {Mapping} mapping - user defined mapping
 * @param {InsertOptions} options - insert options
 *
 * @return {string} compiled output
 */
function insert(
  source: string,
  regex: string,
  mapping: Mapping = {},
  options: InsertOptions = {},
): string {
  const matches = findMatchedRegExp(source, regex);

  const output = matches.reduce(
    (acc, match) => parseAndReplace(acc, match, mapping, options),
    source,
  );

  return output;
}

export default insert;
