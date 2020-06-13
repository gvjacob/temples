import Handlebars from "handlebars";
import { camelCase, kebabCase, snakeCase, startCase } from "lodash";

/**
 * Registers custom casing helpers to the Handlebars environment.
 *
 * @see https://handlebarsjs.com/api-reference/runtime.html#handlebars-registerhelper-name-helper
 */
const registerHelpers = () => {
  // Registers a camelCase helper for the template.
  Handlebars.registerHelper("camel", (string) => {
    return camelCase(string);
  });

  // Registers a kebab-case helper for the template.
  Handlebars.registerHelper("kebab", (string) => {
    return kebabCase(string);
  });

  // Registers a snake_case helper for the template.
  Handlebars.registerHelper("snake", (string) => {
    return snakeCase(string);
  });

  // Registers a TitleCase helper for the template.
  Handlebars.registerHelper("title", (string) => {
    const casedString = startCase(string);
    return casedString.replace(/\s/g, "");
  });
};

/**
 * Parse source with given mapping, overriding the default
 *
 * @params {String} source | handlebars template
 * @params {Object} mapping | handlebars mapping from CLI
 * @params {Object} defaultMapping | default mapping from yaml file
 *
 * @returns {String} parsed source
 */
export const parse = (source, mapping = {}, defaultMapping = {}) => {
  registerHelpers();
  const template = Handlebars.compile(source);
  return template({ ...defaultMapping, ...mapping });
};

export default parse;
