import { contextualize, getParsedTemplate } from '.';

describe('temples', () => {
  describe('getParsedTemplate', () => {
    it('applies mapping if provided', () => {
      const template = 'Hello, {{ name }}';
      const mapping = { name: 'Temple' };

      expect(getParsedTemplate(template, mapping)).toBe(
        `Hello, ${mapping.name}`
      );
    });

    it('applies defaultMapping if provided', () => {
      const template = 'Hello, {{ name }}';
      const defaultMapping = { name: 'Temple' };

      expect(getParsedTemplate(template, {}, defaultMapping)).toBe(
        `Hello, ${defaultMapping.name}`
      );
    });

    it('overrides defaultMapping with mapping', () => {
      const template = '{{ greeting }}, {{ name }}';
      const mapping = { name: 'not Temple' };
      const defaultMapping = { greeting: 'Hello', name: 'Temple' };

      expect(getParsedTemplate(template, mapping, defaultMapping)).toBe(
        `${defaultMapping.greeting}, ${mapping.name}`
      );
    });
  });

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
