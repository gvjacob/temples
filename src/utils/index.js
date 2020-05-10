import fs from 'fs';
import path from 'path';

/**
 * Read file from given path.
 *
 * @param {String} path | path to file
 *
 * @returns {String} encoded file
 */
export const readFile = (path) => {
  return fs.readFileSync(path, 'utf-8');
};

/**
 * Write file to given path.
 *
 * @param {String} filePath | path to file
 * @param {String} content | content of file
 */
export const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
};

/**
 * Resolve path joined by base and
 * relative paths
 *
 * @param {String} base | base path
 * @param {String} relative | path relative to base
 *
 * @returns {String} absolute path
 */
export const resolvePaths = (base, relative) => {
  return path.resolve(path.join(base, relative));
};
