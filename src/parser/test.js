import parse from '.';

describe('parser', () => {
  it('applies mapping if provided', () => {
    const source = 'Hello, {{ name }}';
    const mapping = { name: 'Temple' };

    expect(parse(source, mapping)).toBe(`Hello, ${mapping.name}`);
  });

  it('applies defaultMapping if provided', () => {
    const source = 'Hello, {{ name }}';
    const defaultMapping = { name: 'Temple' };

    expect(parse(source, {}, defaultMapping)).toBe(
      `Hello, ${defaultMapping.name}`
    );
  });

  it('overrides defaultMapping with mapping', () => {
    const source = '{{ greeting }}, {{ name }}';
    const mapping = { name: 'not Temple' };
    const defaultMapping = { greeting: 'Hello', name: 'Temple' };

    expect(parse(source, mapping, defaultMapping)).toBe(
      `${defaultMapping.greeting}, ${mapping.name}`
    );
  });
});
