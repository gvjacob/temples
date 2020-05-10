import { contextualize } from '.';

describe('temples', () => {
  describe('contextualize', () => {
    it('resolves and joins context base with temple template, and output', () => {
      const temple = { template: 'file.template.txt', output: 'file.txt' };
      const context = { base: 'dir' };

      expect(contextualize(temple, context)).toEqual({
        template: `${process.cwd()}/${context.base}/${temple.template}`,
        output: `${process.cwd()}/${context.base}/${temple.output}`,
      });
    });

    it('throws error if output on either temple or context is invalid', () => {
      expect(() => contextualize({ output: '' }, {})).toThrow();
      expect(() => contextualize({}, { base: '' })).toThrow();
      expect(() => contextualize({}, {})).toThrow();
    });
  });
});
