import path from 'path';
import Handlebars, { customize } from '.';

describe('customize', () => {
  const HANDLEBARS_CONFIGURE_PATH = path.resolve(
    'tests/handlebars/configure.js',
  );
  const EMPTY_HANDLEBARS_CONFIGURE_PATH = path.resolve(
    'tests/handlebars/empty-configure.js',
  );

  test('pass Handlebars instance to user configuration file', async () => {
    await customize(HANDLEBARS_CONFIGURE_PATH);
    expect(Handlebars.helpers.foo).toBeTruthy();
  });

  test('bail if configuration file is not found', () => {
    const p = 'notfound.js';

    expect.assertions(1);
    expect(customize(p)).rejects.toEqual(
      new Error(`Handlebars configuration file at ${p} not found.`),
    );
  });

  test('bail if configuration file does not provid function', () => {
    expect.assertions(1);
    expect(customize(EMPTY_HANDLEBARS_CONFIGURE_PATH)).rejects.toEqual(
      new Error(
        `Provide a default function in ${EMPTY_HANDLEBARS_CONFIGURE_PATH}.`,
      ),
    );
  });
});
