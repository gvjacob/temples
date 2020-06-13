import { resolvePaths, getParentAndFile } from '.';

describe('utils', () => {
  describe('resolvePaths', () => {
    it('joins base and relative', () => {
      const base = 'test';
      const relative = 'file.txt';

      expect(resolvePaths(base, relative).endsWith(`${base}/${relative}`));
    });

    it('resolves to absolute path', () => {
      const base = 'test';
      const relative = 'file.txt';

      expect(resolvePaths(base, relative)).toBe(
        `${process.cwd()}/${base}/${relative}`,
      );
    });
  });

  describe('getParentAndFile', () => {
    it('empty string given empty file path', () => {
      expect(getParentAndFile('')).toBe('');
    });

    it('empty string with no file path', () => {
      expect(getParentAndFile()).toBe('');
    });

    it('parent directory and file name', () => {
      expect(getParentAndFile('parent/file.txt')).toBe('parent/file.txt');
      expect(getParentAndFile('grandparent/parent/file.txt')).toBe(
        'parent/file.txt',
      );
    });

    it('only file name when there is no parent', () => {
      expect(getParentAndFile('file.txt')).toBe('file.txt');
    });
  });
});
