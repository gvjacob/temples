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
    const mapping = {
      name: faker.name.firstName(),
    };

    generateFile(target, template, mapping);

    expect(readFile(target)).toBe(`# Hello, ${mapping.name}`);
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
    const mapping = {
      name: faker.name.firstName(),
    };

    generateFile(target, template, mapping);

    expect(readFile(target)).toBe(`# Hello, ${mapping.name}`);
  });

  test('bail if template is specified but does not exist', () => {
    const target = 'output/hello.md';
    const template = 'template.hbs';
    const mapping = {
      name: faker.name.firstName(),
    };

    expect(() => generateFile(target, template, mapping)).toThrow(
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
      const mapping = {
        name: faker.name.firstName(),
      };
      const base = {
        templates: 'templates',
        files: '',
        inserts: '',
      };

      generateFile(target, template, mapping, base);

      expect(readFile(target)).toBe(`# Hello, ${mapping.name}`);
    });

    test('prepend base files path', () => {
      mock({
        'template.hbs': '# Hello, {{ name }}',
      });

      const target = 'output/hello.md';
      const template = 'template.hbs';
      const mapping = {
        name: faker.name.firstName(),
      };
      const base = {
        templates: '',
        files: 'files',
        inserts: 'inserts',
      };

      generateFile(target, template, mapping, base);

      expect(readFile(`${base.files}/${target}`)).toBe(
        `# Hello, ${mapping.name}`,
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

    const mapping = {
      name: 'Paul',
      title: 'Come Together',
    };

    const regex = {
      md: '<!-- (.+) -->',
    };

    generateInsert(target, regex, mapping);

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

    const mapping = {
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
console.log('${mapping.name}')
console.log('Paul')`;

    generateInsert(mdTarget, regex, mapping);
    expect(readFile(mdTarget)).toBe(mdResult);

    generateInsert(jsTarget, regex, mapping);
    expect(readFile(jsTarget)).toBe(jsResult);
  });

  test('bail if target does not exist', () => {
    const target = 'output/hello.md';
    const mapping = {
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
    const mapping = {
      name: faker.name.firstName(),
    };
    const regex = {
      js: '// (.+)',
    };

    expect(() => generateInsert(target, regex, mapping)).toThrow(
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

      const mapping = {
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

      generateInsert(target, regex, mapping, InsertPosition.BELOW, base);

      expect(readFile(`${base.inserts}/${target}`)).toBe(result);
    });
  });
});
