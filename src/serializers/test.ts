import { serializeBasePaths } from '.';

describe('serializeBasePaths', () => {
  test('serialize from base', () => {
    const base = 'dir/subdir';

    const expected = {
      templates: base,
      files: base,
      inserts: base,
    };

    expect(serializeBasePaths(base)).toEqual(expected);
  });

  test('serialize from base: { templates, target }', () => {
    const base = {
      templates: 'templates/subdir',
      target: 'targets/subdir',
    };

    const expected = {
      templates: base.templates,
      files: base.target,
      inserts: base.target,
    };

    expect(serializeBasePaths(base)).toEqual(expected);
  });

  test('serialize from base: { templates, target: { files, inserts } }', () => {
    const base = {
      templates: 'templates/subdir',
      target: {
        files: 'targets/files'
        inserts: 'targets/inserts'
      },
    };

    const expected = {
      templates: base.templates,
      files: base.target.files,
      inserts: base.target.inserts,
    };

    expect(serializeBasePaths(base)).toEqual(expected);
  });
});
