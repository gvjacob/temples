import fs from 'fs';
import path from 'path';

export const readFile = (path) => {
  return fs.readFileSync(path, 'utf-8');
};

export const resolvePaths = (base, relative) => {
  return path.resolve(path.join(base, relative));
};
