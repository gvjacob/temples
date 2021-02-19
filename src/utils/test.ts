import mock from 'mock-fs';
import {
  override,
  isString,
  extract,
  readFile,
  writeFile,
  findMatchedRegExp,
  truncate,
} from '.';

describe('override', () => {
  test('add new keys', () => {
    expect(override({ x: 1 }, { y: 2 })).toEqual({ x: 1, y: 2 });
  });

  test('override exisiting truthy keys', () => {
    expect(override({ x: 1 }, { x: 2 })).toEqual({ x: 2 });
  });
});

describe('extract', () => {
  test('return first value that matches predicate', () => {
    const from = {
      first: {
        second: 'second',
        third: 3,
      },
    };

    const fallback = 123;
    const queries = ['', 'first', 'first.second', 'first.third'];

    const isNumber = (s: any): s is number => typeof s === 'number';

    expect(extract(from, isString, fallback, queries)).toBe(from.first.second);
    expect(extract(from, isNumber, fallback, queries)).toBe(from.first.third);
  });

  test('null query checks original from param', () => {
    const from = 'from';
    const fallback = 123;
    const queries = ['', 'length'];
    const predicate = (s: any): s is string => typeof s === 'string';

    expect(extract(from, predicate, fallback, queries)).toBe(from);
  });

  test('return fallback if no queries provided', () => {
    const from = {
      first: {
        second: 'third',
      },
    };

    const fallback = 123;
    const queries: string[] = [];
    const predicate = isString;

    expect(extract(from, predicate, fallback, queries)).toBe(fallback);
  });

  test('return fallback if no query matches', () => {
    const from = {
      first: {
        second: 'third',
      },
    };

    const fallback = 123;
    const queries = ['fourth'];
    const predicate = (s: any): s is string => typeof s === 'string';

    expect(extract(from, predicate, fallback, queries)).toBe(fallback);
  });

  test('return fallback if predicate returns false', () => {
    const from = {
      first: {
        second: 'third',
      },
    };

    const fallback = 123;
    const queries = ['fourth'];
    const predicate = (s: any): boolean => false;

    expect(extract(from, predicate, fallback, queries)).toBe(fallback);
  });
});

describe('writeFile', () => {
  const filename = 'hello.md';
  const content = '# Hello';

  beforeEach(() => {
    mock();
  });

  afterEach(() => {
    mock.restore();
  });

  test('writes file into path', () => {
    writeFile(filename, content);
    const file = readFile(filename);

    expect(file).toBe(content);
  });

  test('recursively creates missing directories', () => {
    const filePath = `/dir/subdir/${filename}`;

    writeFile(filePath, content);
    const file = readFile(filePath);

    expect(file).toBe(content);
  });
});

describe('findMatchedRegExp', () => {
  test('empty list for empty source', () => {
    expect(findMatchedRegExp('', '.')).toEqual([]);
  });

  test('empty list for empty source and regex', () => {
    expect(findMatchedRegExp('', '')).toEqual([]);
  });

  test('empty list if regex does not match', () => {
    expect(findMatchedRegExp('Hello, World', '^World')).toEqual([]);
  });

  test('find all matched substrings', () => {
    const source = `# Hello
    # Hello`;
    const regex = '# Hello';

    const matches = [
      ['# Hello', null],
      ['# Hello', null],
    ];

    expect(findMatchedRegExp(source, regex)).toEqual(matches);
  });

  test('find all matched substrings and groups', () => {
    const source = `# Hello
    # World`;
    const regex = '# (.+)';

    const matches = [
      ['# Hello', 'Hello'],
      ['# World', 'World'],
    ];

    expect(findMatchedRegExp(source, regex)).toEqual(matches);
  });

  test('find all matches in beginning, middle, and end', () => {
    const source = `# The Long
    And Winding Road

    # That leads to your door

    Will never disappear
    I've seen that road before

    It always leads me here # Lead me to your door
    `;
    const regex = '# (.+)';

    const matches = [
      ['# The Long', 'The Long'],
      ['# That leads to your door', 'That leads to your door'],
      ['# Lead me to your door', 'Lead me to your door'],
    ];

    expect(findMatchedRegExp(source, regex)).toEqual(matches);
  });
});

describe('truncate', () => {
  it('empty string given empty file path', () => {
    expect(truncate('')).toBe('');
  });

  it('parent directory and file name', () => {
    expect(truncate('parent/file.txt')).toBe('parent/file.txt');
    expect(truncate('grandparent/parent/file.txt')).toBe('parent/file.txt');
  });

  it('only file name when there is no parent', () => {
    expect(truncate('file.txt')).toBe('file.txt');
  });
});
