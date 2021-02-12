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

  test('bail if template does not exist', () => {
    const target = 'output/hello.md';
    const template = 'template.hbs';
    const mapping = {
      name: faker.name.findName(),
    };

    expect(() => file(target, template, mapping)).toThrow(Error);
  });
});
