import { compile } from 'handlebars';

/**
 * Parse template with given mapping
 *
 * @param {String} template | handlebars template
 * @param {Object} mapping | handlebars mapping
 *
 * @returns {String} parsed template
 */
const parse = (template, mapping = {}) => {
  return compile(template)(mapping);
};

export default parse;
