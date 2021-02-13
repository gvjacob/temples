import { extract } from '../utils';
import { BasePath, BasePathConfig } from '../types';

/**
 * Serialize base paths config.
 *
 * @param {BasePathConfig} base
 *
 * @return {BasePath} serialized base paths
 */
export function serializeBasePaths(base: BasePathConfig): BasePath {
  const isString = (s: any): s is string => typeof s === 'string';

  return {
    templates: extract(base, isString, '', [null, 'templates']),
    files: extract(base, isString, '', [null, 'target', 'target.files']),
    inserts: extract(base, isString, '', [null, 'target', 'target.inserts']),
  };
}
