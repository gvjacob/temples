import { InsertOptions, InsertPosition, RegExpMatch, Props } from '../types';

import { findMatchedRegExp } from '../utils';
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
  props: Props = {},
  options: InsertOptions = {},
): string {
  const [match, group] = regexMatch;

  if (!group) {
    return source;
  }

  const parsed = parse(group, props);
  const output = placeRelativeTo(match, parsed, options.position);

  return source.replace(match, output);
}

/**
 * Insert parsed output into given source.
 *
 * @param {string} source - template source
 * @param {string} regex - regex pattern for source
 * @param {Props} props - user defined props
 * @param {InsertOptions} options - insert options
 *
 * @return {string} compiled output
 */
function insert(
  source: string,
  regex: string,
  props: Props = {},
  options: InsertOptions = {},
): string {
  const matches = findMatchedRegExp(source, regex);

  const output = matches.reduce(
    (acc, match) => parseAndReplace(acc, match, props, options),
    source,
  );

  return output;
}

export default insert;
