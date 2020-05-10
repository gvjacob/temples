import { resolvePaths } from '.';

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
        `${process.cwd()}/${base}/${relative}`
      );
    });
  });
});
