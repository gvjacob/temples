import insert from '.';
import { InsertPosition } from './types';

const regex = `<!-- temples\\((.+)\\) -->`;

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

describe('with mapping', () => {
  const source = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- Paul
- John`;

  const mapping = {
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

    expect(insert(source, regex, mapping)).toBe(expected);
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

    expect(insert(source, regex, mapping, {}, options)).toBe(expected);
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

    expect(insert(source, regex, mapping, {}, options)).toBe(expected);
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

    expect(insert(source, regex, mapping, {}, options)).toBe(expected);
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

    expect(insert(source, regex, mapping, {}, options)).toBe(expected);
  });
});
