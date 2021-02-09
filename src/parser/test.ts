import parse from '.';
import faker from 'faker';

test('inject variables from mapping', () => {
  const mapping = {
    greeting: 'Hello',
    name: faker.lorem.word(),
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
      name: faker.lorem.word(),
    };

    expect(parse('{{ greeting }}, {{ name }}', {}, mapping)).toBe(`${mapping.greeting}, ${mapping.name}`);
  });

  test('override default mapping with variables from mapping', () => {
    const mapping = {
      greeting: 'Hi',
      name: faker.lorem.word(),
    };

    const defaultMapping = {
      greeting: 'Hello',
      name: faker.lorem.word(),
    };

    expect(parse('{{ greeting }}, {{ name }}', mapping, defaultMapping)).toBe(`${mapping.greeting}, ${mapping.name}`);
  });
});

describe('with built-in helpers', () => {
  test('apply case helpers', () => {
    const name = 'keytar bear';

    const cases = {
      ['camel-case']: 'keytarBear',
      ['kebab-case']: 'keytar-bear',
      ['snake-case']: 'keytar_bear',
      ['upper-case']: 'KEYTAR BEAR',
      ['start-case']: 'Keytar Bear',
      ['title-case']: 'KeytarBear',
    };

    Object.entries(cases).forEach(([filter, output]) => {
      expect(parse(`{{ ${filter} name }}`, { name })).toBe(output);
    });
  });
});

describe('with parser options', () => {
  const source = faker.lorem.word();

  test('prepend before string', () => {
    const options = {
      before: 'before',
    };

    expect(parse(source, {}, {}, options)).toBe(`${options.before}${source}`);
  });

  test('append after string', () => {
    const options = {
      after: 'after',
    };

    expect(parse(source, {}, {}, options)).toBe(`${source}${options.after}`);
  });

  test('prepend before, and append after', () => {
    const options = {
      before: 'before',
      after: 'after',
    };

    expect(parse(source, {}, {}, options)).toBe(`${options.before}${source}${options.after}`);
  });
});
