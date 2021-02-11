import { isEmpty } from 'lodash';

import { RegExpMatch } from './types';

/**
 * Find all matched regex substrings.
 *
 * @param {string} source
 * @param {string} regex - regex pattern
 *
 * @return {RegExpMatch[]} matching substrings
 */
export function findMatchedRegExp(source: string, regex: string): RegExpMatch[] {
  const matches: RegExpMatch[] = [];

  if (isEmpty(regex)) {
    return matches;
  }

  const re = new RegExp(regex, 'gm');

  let m;

  while ((m = re.exec(source)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }

    const [match, group = null] = m;
    matches.push([match, group]);
  }

  return matches;
}
