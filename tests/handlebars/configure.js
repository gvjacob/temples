module.exports = (handlebars) => {
  handlebars.registerHelper('foo', () => {});

  return {
    noEscape: true,
  };
};
