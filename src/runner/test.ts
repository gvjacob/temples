import mock from 'mock-fs';
import faker from 'faker';
import run from '.';
import { TemplesConfig } from '../types';
import { readFile } from '../utils';

test('bail if generator command is not found', () => {
  const generator = 'test';
  const props = {
    name: faker.name.firstName(),
  };

  const temples: TemplesConfig = {
    regex: {
      md: '<!-- temples: (.+) -->',
    },
    generators: {
      notTest: {
        files: [
          {
            target: 'output/empty.md',
          },
        ],
      },
    },
  };

  expect(() => run(generator, props, temples)).toThrow(
    new Error(`Command ${generator} not found in temples configuration.`),
  );
});

test('bail if generator has no files or inserts', () => {
  const generator = 'test';
  const props = {
    name: faker.name.firstName(),
  };

  const temples: TemplesConfig = {
    regex: {
      md: '<!-- temples: (.+) -->',
    },
    generators: {
      test: {},
    },
  };

  expect(() => run(generator, props, temples)).toThrow(
    new Error(`Specify files or inserts for ${generator}.`),
  );
});

describe('generate files', () => {
  const generator = 'test';
  const props = {
    name: faker.name.firstName(),
  };
  const temples: TemplesConfig = {
    regex: {
      md: '<!-- temples: (.+) -->',
    },
    generators: {
      test: {
        files: [
          {
            target: 'output/empty.md',
          },
          {
            template: 'templates/with-template.hbs',
            target: 'output/with-template.md',
          },
        ],
      },
    },
  };

  beforeEach(() => {
    mock({
      templates: {
        'with-template.hbs': '{{ name }}',
      },
    });
  });

  afterEach(mock.restore);

  test('create empty file if no template', () => {
    expect(readFile('output/empty.md')).toBeNull();

    run(generator, props, temples);
    expect(readFile('output/empty.md')).toBe('');
  });

  test('create file with template and props', () => {
    expect(readFile('output/with-template.md')).toBeNull();

    run(generator, props, temples);
    expect(readFile('output/with-template.md')).toBe(props.name);
  });
});

describe('with nested base', () => {
  const generator = 'test';
  const props = {
    name: faker.name.firstName(),
  };
  const temples: TemplesConfig = {
    regex: {
      md: '<!-- temples: (.+) -->',
    },
    base: {
      templates: 'templates',
      target: 'targets',
    },
    generators: {
      test: {
        base: {
          target: 'nested-targets',
        },
        files: [
          {
            target: 'empty.md',
          },
          {
            template: 'with-template.hbs',
            target: 'with-template.md',
          },
        ],
      },
    },
  };

  beforeEach(() => {
    mock({
      templates: {
        'with-template.hbs': '{{ name }}',
      },
    });
  });

  afterEach(mock.restore);

  test('override top level base', () => {
    run(generator, props, temples);
    expect(readFile('nested-targets/with-template.md')).toBe(props.name);
  });
});

describe('with nested regex', () => {});
describe('with nested default props', () => {});
