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
      `Hello, ${defaultMapping.name}`,
    );
  });

  it('overrides defaultMapping with mapping', () => {
    const source = '{{ greeting }}, {{ name }}';
    const mapping = { name: 'not Temple' };
    const defaultMapping = { greeting: 'Hello', name: 'Temple' };

    expect(parse(source, mapping, defaultMapping)).toBe(
      `${defaultMapping.greeting}, ${mapping.name}`,
    );
  });

  it('applies camelCase helper to template', () => {
    const source = 'Hello, {{ camel name }}';
    const mapping = { name: 'BigButton' };

    expect(parse(source, mapping)).toBe(`Hello, bigButton`);
  });

  it('applies kebab-case helper to template', () => {
    const source = 'Hello, {{ kebab name }}';
    const mapping = { name: 'BigButton' };

    expect(parse(source, mapping)).toBe(`Hello, big-button`);
  });

  it('applies snake_case helper to template', () => {
    const source = 'Hello, {{ snake name }}';
    const mapping = { name: 'BigButton' };

    expect(parse(source, mapping)).toBe(`Hello, big_button`);
  });

  it('applies TitleCase helper to template', () => {
    const source = 'Hello, {{ title name }}';
    const mapping = { name: 'big-button' };

    expect(parse(source, mapping)).toBe(`Hello, BigButton`);
  });

  it('avoids helper and variable name conflicts using "this" or "./"', () => {
    const sources = ['Hello, {{ this.title }}', 'Hello, {{ ./title }}'];
    const mapping = { title: 'big-button' };

    sources.forEach((source) => {
      expect(parse(source, mapping)).toBe(`Hello, big-button`);
    });
  });
});
