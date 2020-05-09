import { compile } from 'handlebars';

const parse = (template, mapping = {}) => {
  return compile(template)(mapping);
};

export default parse;
