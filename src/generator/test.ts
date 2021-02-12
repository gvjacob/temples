import fs from 'fs';
import faker from 'faker';
import mock from 'mock-fs';

import { file } from '.';
import { readFile } from '../utils';

describe('file', () => {
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
      name: faker.name.findName(),
    };

    file(target, template, mapping);

    expect(readFile(target)).toBe(`# Hello, ${mapping.name}`);
  });

  test('override existing targeted file', () => {
    mock({
      'template.hbs': '# Hello, {{ name }}',
      output: {
        'hello.md': `# Hello, ${faker.name.findName()}`,
      },
    });

    const target = 'output/hello.md';
    const template = 'template.hbs';
    const mapping = {
      name: faker.name.findName(),
    };

    file(target, template, mapping);

    expect(readFile(target)).toBe(`# Hello, ${mapping.name}`);
  });

  test('bail if template does not exist', () => {
    const target = 'output/hello.md';
    const template = 'template.hbs';
    const mapping = {
      name: faker.name.findName(),
    };

    expect(() => file(target, template, mapping)).toThrow(Error);
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
        name: faker.name.findName(),
      };
      const base = {
        templates: 'templates',
        files: '',
        inserts: '',
      };

      file(target, template, mapping, base);

      expect(readFile(target)).toBe(`# Hello, ${mapping.name}`);
    });

    test('prepend base files path', () => {
      mock({
        'template.hbs': '# Hello, {{ name }}',
      });

      const target = 'output/hello.md';
      const template = 'template.hbs';
      const mapping = {
        name: faker.name.findName(),
      };
      const base = {
        templates: '',
        files: 'files',
        inserts: 'inserts',
      };

      file(target, template, mapping, base);

      expect(readFile(`${base.files}/${target}`)).toBe(
        `# Hello, ${mapping.name}`,
      );
    });
  });
});
