import parse from '.';
import faker from 'faker';

test('inject variables from mapping', () => {
  const mapping = {
    greeting: 'Hello',
    name: faker.lorem.word(),
  };

  expect(parse('{{ greeting }}, {{ name }}', mapping)).toBe(
    `${mapping.greeting}, ${mapping.name}`,
  );
});

test('preserve variables if escaped', () => {
  const source = `\\{{ name }}`;
  expect(parse(source, {})).toBe('{{ name }}');
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
