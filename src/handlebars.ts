import Handlebars from 'handlebars';
import { camelCase, kebabCase, snakeCase, upperCase, startCase } from 'lodash';

/**
 * Registers custom casing helpers to the Handlebars environment.
 *
 * @see https://handlebarsjs.com/api-reference/runtime.html#handlebars-registerhelper-name-helper
 */
Handlebars.registerHelper('camel-case', camelCase);
Handlebars.registerHelper('kebab-case', kebabCase);
Handlebars.registerHelper('snake-case', snakeCase);
Handlebars.registerHelper('upper-case', upperCase);
Handlebars.registerHelper('start-case', startCase);
Handlebars.registerHelper('title-case', (s: string): string => {
  const casedString = startCase(s);
  return casedString.replace(/\s/g, '');
});

export default Handlebars;
