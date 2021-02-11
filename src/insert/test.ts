import insert from '.';

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

  test('default inserts below comment tag', () => {
    const expected = `
# Beatles

Members.
<!-- temples(- {{ name }}) -->
- George
- Paul
- John`;

    expect(insert(source, regex, mapping)).toBe(expected);
  });
});
