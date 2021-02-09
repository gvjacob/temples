import Handlebars from 'handlebars';

/**
 * Parse source with given mapping, overriding the default.
 *
 * @param {string} source - template source
 * @param {object} mapping - user defined mapping
 * @param {object} defaultMapping - default or fallback mapping
 *
 * @return {string} parsed output
 */
export function parse(source: string, mapping = {}, defaultMapping = {}) {
  const template = Handlebars.compile(source);
  return template({ ...defaultMapping, ...mapping });
}
