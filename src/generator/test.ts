import path from 'path';
import fs from 'fs';
import faker from 'faker';
import mock from 'mock-fs';

import { generateFile, generateInsert } from '.';
import { InsertPosition } from '../types';
import { readFile } from '../utils';

describe('generateFile', () => {
  beforeEach(() => {
    mock();
  });

  afterEach(mock.restore);

  test('create new file based on parsed template', () => {
    mock({
      'template.hbs': '# Hello, {{ name }}',
    });

    const target = 'output/hello.md';
    const template = 'template.hbs';
    const props = {
      name: faker.name.firstName(),
    };

    generateFile(target, template, props);

    expect(readFile(target)).toBe(`# Hello, ${props.name}`);
  });

  test('generate empty new file if template is not provided', () => {
    mock();

    const target = 'output/hello.md';

    generateFile(target);

    expect(readFile(target)).toBe('');
  });

  test('override existing targeted file', () => {
    mock({
      'template.hbs': '# Hello, {{ name }}',
      output: {
        'hello.md': `# Hello, ${faker.name.firstName()}`,
      },
    });

    const target = 'output/hello.md';
    const template = 'template.hbs';
    const props = {
      name: faker.name.firstName(),
    };

    generateFile(target, template, props);

    expect(readFile(target)).toBe(`# Hello, ${props.name}`);
  });

  test('bail if template is specified but does not exist', () => {
    const target = 'output/hello.md';
    const template = 'template.hbs';
    const props = {
      name: faker.name.firstName(),
    };

    expect(() => generateFile(target, template, props)).toThrow(
      new Error(`Template at ${path.resolve(template)} does not exist.`),
    );
  });

  describe('with base paths', () => {
    test('prepend base templates path', () => {
      mock({
        templates: {
          'template.hbs': '# Hello, {{ name }}',
        },
      });

      const target = 'output/hello.md';
      const template = 'template.hbs';
      const props = {
        name: faker.name.firstName(),
      };
      const base = {
        templates: 'templates',
        files: '',
        inserts: '',
      };

      generateFile(target, template, props, base);

      expect(readFile(target)).toBe(`# Hello, ${props.name}`);
    });

    test('prepend base files path', () => {
      mock({
        'template.hbs': '# Hello, {{ name }}',
      });

      const target = 'output/hello.md';
      const template = 'template.hbs';
      const props = {
        name: faker.name.firstName(),
      };
      const base = {
        templates: '',
        files: 'files',
        inserts: 'inserts',
      };

      generateFile(target, template, props, base);

      expect(readFile(`${base.files}/${target}`)).toBe(
        `# Hello, ${props.name}`,
      );
    });
  });
});

describe('generateInsert', () => {
  beforeEach(() => {
    mock();
  });

  afterEach(mock.restore);

  test('Modify targeted file with parsed output', () => {
    mock({
      output: {
        'hello.md': `
# Beatles

## Members
<!-- - {{ name }} -->
- John

## Songs
<!-- - {{ title }} -->
- Yesterday`,
      },
    });

    const result = `
# Beatles

## Members
<!-- - {{ name }} -->
- Paul
- John

## Songs
<!-- - {{ title }} -->
- Come Together
- Yesterday`;

    const target = 'output/hello.md';

    const props = {
      name: 'Paul',
      title: 'Come Together',
    };

    const regex = {
      md: '<!-- (.+) -->',
    };

    generateInsert(target, regex, props);

    expect(readFile(target)).toBe(result);
  });

  test('Use the right regex patterns for targeted files', () => {
    mock({
      output: {
        'hello.md': `
# Beatles

## Members
<!-- - {{ name }} -->
- John

## Songs
<!-- - {{ title }} -->
- Yesterday`,
        'hello.js': `
// console.log('{{ name }}')
console.log('Paul')`,
      },
    });

    const mdTarget = 'output/hello.md';
    const jsTarget = 'output/hello.js';

    const props = {
      name: 'Paul',
      title: 'Come Together',
    };

    const regex = {
      md: '<!-- (.+) -->',
      js: '// (.+)',
    };

    const mdResult = `
# Beatles

## Members
<!-- - {{ name }} -->
- Paul
- John

## Songs
<!-- - {{ title }} -->
- Come Together
- Yesterday`;

    const jsResult = `
// console.log('{{ name }}')
console.log('${props.name}')
console.log('Paul')`;

    generateInsert(mdTarget, regex, props);
    expect(readFile(mdTarget)).toBe(mdResult);

    generateInsert(jsTarget, regex, props);
    expect(readFile(jsTarget)).toBe(jsResult);
  });

  test('bail if target does not exist', () => {
    const target = 'output/hello.md';
    const props = {
      name: faker.name.firstName(),
    };
    const regex = {
      md: '# (.+)',
    };

    expect(() => generateInsert(target, regex, {})).toThrow(
      new Error(`Target at ${target} does not exist.`),
    );
  });

  test('bail if matching regex does not exist', () => {
    mock({
      output: {
        'hello.md': '',
      },
    });

    const target = 'output/hello.md';
    const props = {
      name: faker.name.firstName(),
    };
    const regex = {
      js: '// (.+)',
    };

    expect(() => generateInsert(target, regex, props)).toThrow(
      new Error(`Specify regex pattern for ${path.resolve(target)}.`),
    );
  });

  describe('with base paths', () => {
    test('prepend insert base path', () => {
      mock({
        output: {
          'hello.md': `
# Beatles

## Members
<!-- - {{ name }} -->
- John

## Songs
<!-- - {{ title }} -->
- Yesterday`,
        },
      });

      const result = `
# Beatles

## Members
<!-- - {{ name }} -->
- Paul
- John

## Songs
<!-- - {{ title }} -->
- Come Together
- Yesterday`;

      const target = 'hello.md';

      const props = {
        name: 'Paul',
        title: 'Come Together',
      };

      const regex = {
        md: '<!-- (.+) -->',
      };

      const base = {
        templates: '',
        files: '',
        inserts: 'output',
      };

      generateInsert(target, regex, props, InsertPosition.BELOW, base);

      expect(readFile(`${base.inserts}/${target}`)).toBe(result);
    });
  });
});
