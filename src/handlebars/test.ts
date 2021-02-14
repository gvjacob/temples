import fs from 'fs';
import path from 'path';
import mock from 'mock-fs';
import Handlebars, { customize } from '.';

describe('customize', () => {
  afterEach(mock.restore);

  test('pass Handlebars instance to user configuration file', async () => {
    const HANDLEBARS_CONFIGURE_PATH = 'tests/configureHandlebars.js';

    await customize(path.resolve(HANDLEBARS_CONFIGURE_PATH));
    expect(Handlebars.helpers.foo).toBeTruthy();
  });
});
