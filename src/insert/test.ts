import insert from '.';
import { InsertPosition } from '../types';

const regex = `<!-- temples\\((.+)\\) -->`;

test('preserve original source if no matching regex', () => {
  const source = `
# Beatles

Members.
<!-- temples(- Ringo) -->
- Paul
- John`;

  expect(insert(source, '')).toBe(source);
});

test('preserve Handlebars variables if no matching regex but there is props', () => {
  const source = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- Paul
- John`;

  expect(insert(source, '', { name: 'George' })).toBe(source);
});

test('insert under all patterns that match regex', () => {
  const source = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- Paul
- John

Songs
<!-- temples(- {{ title }}) -->
- Yesterday`;

  const expected = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- George
- Paul
- John

Songs
<!-- temples(- {{ title }}) -->
- Come Together
- Yesterday`;

  expect(
    insert(source, regex, { name: 'George', title: 'Come Together' }),
  ).toBe(expected);
});

test('respect hardcoded inserts', () => {
  const source = `
# Beatles

Members.
<!-- temples(- Ringo) -->
- Paul
- John`;

  const expected = `
# Beatles

Members.
<!-- temples(- Ringo) -->
- Ringo
- Paul
- John`;

  expect(insert(source, regex)).toBe(expected);
});

describe('with insert position', () => {
  const source = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- Paul
- John`;

  const props = {
    name: 'George',
  };

  test('insert below by default', () => {
    const expected = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- George
- Paul
- John`;

    expect(insert(source, regex, props)).toBe(expected);
  });

  test('insert below', () => {
    const expected = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- George
- Paul
- John`;

    const options = {
      position: InsertPosition.BELOW,
    };

    expect(insert(source, regex, props, options)).toBe(expected);
  });

  test('insert above', () => {
    const expected = `
# Beatles

Members.
- George
<!-- temples(- {{ name }}) -->
- Paul
- John`;

    const options = {
      position: InsertPosition.ABOVE,
    };

    expect(insert(source, regex, props, options)).toBe(expected);
  });

  test('insert left', () => {
    const expected = `
# Beatles

Members.
- George<!-- temples(- {{ name }}) -->
- Paul
- John`;

    const options = {
      position: InsertPosition.LEFT,
    };

    expect(insert(source, regex, props, options)).toBe(expected);
  });

  test('insert right', () => {
    const expected = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->- George
- Paul
- John`;

    const options = {
      position: InsertPosition.RIGHT,
    };

    expect(insert(source, regex, props, options)).toBe(expected);
  });
});
