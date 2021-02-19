import path from 'path';
import fs from 'fs';
import faker from 'faker';
import mock from 'mock-fs';

import { ListrGenerateFile, ListrGenerateInsert } from '.';
import { InsertPosition } from '../types';
import { readFile } from '../utils';
import { ListrTaskWrapper } from 'listr';

describe('ListrGenerateFile', () => {
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

    ListrGenerateFile(target, template, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );

    expect(readFile(target)).toBe(`# Hello, ${props.name}`);
  });

  test('generate empty new file if template is not provided', () => {
    mock();

    const target = 'output/hello.md';

    ListrGenerateFile(target).task({}, {} as ListrTaskWrapper<any>);

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

    ListrGenerateFile(target, template, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );

    expect(readFile(target)).toBe(`# Hello, ${props.name}`);
  });

  test('bail if template is specified but does not exist', () => {
    const target = 'output/hello.md';
    const template = 'template.hbs';
    const props = {
      name: faker.name.firstName(),
    };

    expect(() =>
      ListrGenerateFile(target, template, props).task(
        {},
        {} as ListrTaskWrapper<any>,
      ),
    ).toThrow(
      new Error(`Template at ${path.resolve(template)} does not exist.`),
    );
  });

  test('apply props to templates path', () => {
    const target = 'output/hello.md';
    const template = '{{ name }}.hbs';
    const props = {
      name: faker.name.firstName(),
    };

    mock({
      [`${props.name}.hbs`]: '# Hello, {{ name }}',
    });

    ListrGenerateFile(target, template, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );

    expect(readFile(target)).toBe(`# Hello, ${props.name}`);
  });

  test('apply props to target path', () => {
    const target = '{{ name }}/hello.md';
    const template = 'template.hbs';
    const props = {
      name: faker.name.firstName(),
    };

    mock({
      'template.hbs': '# Hello, {{ name }}',
    });

    ListrGenerateFile(target, template, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );

    expect(readFile(`${props.name}/hello.md`)).toBe(`# Hello, ${props.name}`);
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

      ListrGenerateFile(target, template, props, base).task(
        {},
        {} as ListrTaskWrapper<any>,
      );

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

      ListrGenerateFile(target, template, props, base).task(
        {},
        {} as ListrTaskWrapper<any>,
      );

      expect(readFile(`${base.files}/${target}`)).toBe(
        `# Hello, ${props.name}`,
      );
    });
  });
});

describe('ListrGenerateInsert', () => {
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

    ListrGenerateInsert(target, regex, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );

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

    ListrGenerateInsert(mdTarget, regex, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );
    expect(readFile(mdTarget)).toBe(mdResult);

    ListrGenerateInsert(jsTarget, regex, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );
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

    expect(() =>
      ListrGenerateInsert(target, regex, {}).task(
        {},
        {} as ListrTaskWrapper<any>,
      ),
    ).toThrow(new Error(`Target at ${path.resolve(target)} does not exist.`));
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

    expect(() =>
      ListrGenerateInsert(target, regex, props).task(
        {},
        {} as ListrTaskWrapper<any>,
      ),
    ).toThrow(new Error(`Specify regex pattern for ${path.resolve(target)}.`));
  });

  test('apply props to target path', () => {
    const target = '{{ name }}/{{ title }}.md';

    const props = {
      name: 'Paul',
      title: 'Blackbird',
    };

    const regex = {
      md: '<!-- (.+) -->',
    };

    mock({
      [props.name]: {
        [`${props.title}.md`]: `
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
- Blackbird
- Yesterday`;

    ListrGenerateInsert(target, regex, props).task(
      {},
      {} as ListrTaskWrapper<any>,
    );

    expect(readFile(`${props.name}/${props.title}.md`)).toBe(result);
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

      ListrGenerateInsert(target, regex, props, 'below', base).task(
        {},
        {} as ListrTaskWrapper<any>,
      );

      expect(readFile(`${base.inserts}/${target}`)).toBe(result);
    });
  });
});
