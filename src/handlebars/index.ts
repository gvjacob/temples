import fs from 'fs';
import Handlebars from 'handlebars';
import {
  isEmpty,
  camelCase,
  kebabCase,
  snakeCase,
  upperCase,
  lowerCase,
  startCase,
} from 'lodash';

/**
 * Registers custom casing helpers to the Handlebars environment.
 *
 * @see https://handlebarsjs.com/api-reference/runtime.html#handlebars-registerhelper-name-helper
 */
Handlebars.registerHelper('camel-case', camelCase);
Handlebars.registerHelper('kebab-case', kebabCase);
Handlebars.registerHelper('snake-case', snakeCase);
Handlebars.registerHelper('upper-case', upperCase);
Handlebars.registerHelper('lower-case', lowerCase);
Handlebars.registerHelper('start-case', startCase);
Handlebars.registerHelper('title-case', (s: string): string => {
  const casedString = startCase(s);
  return casedString.replace(/\s/g, '');
});

export let compileOptions = {};

/**
 * Customize Handlebars instance through
 * user defined configuration.
 *
 * @param {string} p - path to user defined configuration
 */
export async function customize(p: string) {
  if (!fs.existsSync(p)) {
    throw new Error(`Handlebars configuration file at ${p} not found.`);
  }

  const { default: configure } = await import(p);

  // Throw if configuration file does not
  // provide a default function.
  if (typeof configure !== 'function') {
    throw new Error(`Provide a default function in ${p}.`);
  }

  compileOptions = configure(Handlebars) || compileOptions;
}

export default Handlebars;
