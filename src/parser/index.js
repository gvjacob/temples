import { compile } from 'handlebars';

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
  const template = compile(source);
  return template({ ...defaultMapping, ...mapping });
};

export default parse;
