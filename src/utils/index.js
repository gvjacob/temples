import fs from 'fs';
import path from 'path';
import { takeRight } from 'lodash';

/**
 * Read file from given path.
 *
 * @param {String} path | path to file
 *
 * @returns {String} encoded file
 */
export const readFile = (path) => {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (e) {
    return null;
  }
};

/**
 * Write file to given path.
 *
 * @param {String} filePath | path to file
 * @param {String} content | content of file
 */
export const writeFile = (filePath, content) => {
  const directory = path.dirname(filePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

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
export const resolvePaths = (base = '', relative = '') => {
  return path.resolve(path.join(base, relative));
};

/**
 * Get the parent directory and file name
 *
 * @param {String} filePath | file path
 *
 * @returns {String} parent and file name
 */
export const getParentAndFile = (filePath = '') => {
  const sections = filePath.split(path.sep);
  return takeRight(sections, 2).join(path.sep);
};
