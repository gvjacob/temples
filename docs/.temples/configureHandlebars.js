module.exports = (handlebars) => {
  // Convert into relative path
  // BigButton -> ./BigButton
  handlebars.registerHelper('relative', (v) => `./${v}`);

  return {
    noEscape: false,
  };
};
