import insert from '.';

const source = `
# Beatles

Members.
<!-- temples(- {{ name }})-->
- Paul
- John
`;

const regex = `<!-- temples\((.+)\) -->`;

const mapping = {
  name: 'George',
};

test('preserve source without configuration', () => {
  expect(insert(source, regex)).toBe(source);
});

describe('with mapping', () => {
  test('default inserts below comment tag', () => {
    const output = `
# Beatles

Members.
<!-- temples(- {{ name }})-->
- George
- Paul
- John
    `;

    expect(insert(source, regex, mapping)).toBe(output);
  });
});
