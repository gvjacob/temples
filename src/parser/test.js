import parse from '.';

describe('parser', () => {
  it('replaces keywords in template with mapping', () => {
    const template = 'Hello, {{ name }}';
    const mapping = { name: 'Temple' };
    const output = parse(template, mapping);

    expect(output).toBe(`Hello, ${mapping.name}`);
  });
});
