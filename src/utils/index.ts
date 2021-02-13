import fs from 'fs';
import path from 'path';
import { isEmpty, get, isNull } from 'lodash';

import { RegExpMatch, BasePath, BasePathConfig } from '../types';

/**
 * Extract value found from first query
 * that yields a truthy value.
 *
 * @param {any} from
 * @param {T} fallback
 * @param {(string | null)[]} queries
 *
 * @return {any | T}
 */
export function extract<T>(
  from: any,
  predicate: (s: any) => boolean,
  fallback: T,
  queries: (string | null)[] = [],
): any | T {
  for (const query of queries) {
    const value = isNull(query) ? from : get(from, query);

    if (predicate(value)) {
      return value;
    }
  }

  return fallback;
}

/**
 * Read file from given path.
 *
 * @param {string} p - path
 *
 * @return {string} encoded file
 */
export function readFile(p: string): string | null {
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch (e) {
    return null;
  }
}

/**
 * Write file to given path.
 *
 * @param {string} p - path to file
 * @param {string} content
 */
export const writeFile = (p: string, content: string) => {
  const directory = path.dirname(p);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(p, content);
};

/**
 * Find all matched regex substrings.
 *
 * @param {string} source
 * @param {string} regex - regex pattern
 *
 * @return {RegExpMatch[]} matching substrings
 */
export function findMatchedRegExp(
  source: string,
  regex: string,
): RegExpMatch[] {
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
