import { parse } from '.';
import faker from 'faker';

test('inject variables from mapping', () => {
  const mapping = {
    greeting: 'Hello',
    name: faker.name.findName(),
  };

  expect(parse('{{ greeting }}, {{ name }}', mapping)).toBe(`${mapping.greeting}, ${mapping.name}`);
});

test('preserve variables if escaped', () => {
  const source = `\\{{ name }}`;
  expect(parse(source, {})).toBe('{{ name }}');
});

describe('with default mapping', () => {
  test('inject variables from default mapping', () => {
    const mapping = {
      greeting: 'Hello',
      name: faker.name.findName(),
    };

    expect(parse('{{ greeting }}, {{ name }}', {}, mapping)).toBe(`${mapping.greeting}, ${mapping.name}`);
  });

  test('override default mapping with variables from mapping', () => {
    const mapping = {
      greeting: 'Hi',
      name: faker.name.findName(),
    };

    const defaultMapping = {
      greeting: 'Hello',
      name: faker.name.findName(),
    };

    expect(parse('{{ greeting }}, {{ name }}', mapping, defaultMapping)).toBe(`${mapping.greeting}, ${mapping.name}`);
  });
});
