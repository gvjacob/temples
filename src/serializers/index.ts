import { extract, isString } from '../utils';
import { BasePath, BasePathConfig } from '../types';

/**
 * Serialize base paths config.
 *
 * @param {BasePathConfig} base
 *
 * @return {BasePath} serialized base paths
 */
export function serializeBasePathsConfig(base: BasePathConfig): BasePath {
  return {
    templates: extract(base, isString, '', ['', 'templates']),
    files: extract(base, isString, '', ['', 'target', 'target.files']),
    inserts: extract(base, isString, '', ['', 'target', 'target.inserts']),
  };
}
