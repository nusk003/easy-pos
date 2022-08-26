module.exports = function (source) {
  source = source.replace(/@.*/g, '');
  return source;
};
