import insert from '.';

const source = `
# Beatles

Members.
<!-- temples(- {{ name }})-->
- Paul
- John
`;

const extension = 'md';

test('preserve source without configuration', () => {
  expect(insert(source, extension)).toBe(source);
});
