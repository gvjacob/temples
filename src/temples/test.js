import { contextualize } from '.';

describe('temples', () => {
  describe('contextualize', () => {
    describe('base', () => {
      it('resolves and joins context base with temple template, and output', () => {
        const temple = { template: 'file.template.txt', output: 'file.txt' };
        const context = { base: 'dir' };

        expect(contextualize(temple, context)).toEqual({
          template: `${process.cwd()}/${context.base}/${temple.template}`,
          output: `${process.cwd()}/${context.base}/${temple.output}`,
        });
      });
    });

    describe('base: template, output', () => {
      it('resolves and joins base template and output', () => {
        const temple = { template: 'file.template.txt', output: 'file.txt' };
        const context = { base: { template: 'templates', output: 'outputs' } };

        expect(contextualize(temple, context)).toEqual({
          template: `${process.cwd()}/${context.base.template}/${
            temple.template
          }`,
          output: `${process.cwd()}/${context.base.output}/${temple.output}`,
        });
      });

      it('resolves and joins base template only', () => {
        const temple = { template: 'file.template.txt', output: 'file.txt' };
        const context = { base: { template: 'templates' } };

        expect(contextualize(temple, context)).toEqual({
          template: `${process.cwd()}/${context.base.template}/${
            temple.template
          }`,
          output: `${process.cwd()}/${temple.output}`,
        });
      });

      it('resolves and joins base output only', () => {
        const temple = { template: 'file.template.txt', output: 'file.txt' };
        const context = { base: { output: 'outputs' } };

        expect(contextualize(temple, context)).toEqual({
          template: `${process.cwd()}/${temple.template}`,
          output: `${process.cwd()}/${context.base.output}/${temple.output}`,
        });
      });
    });
  });
});
