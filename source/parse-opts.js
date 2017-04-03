const { dirname } = require('path');

module.exports = (
  path,
  {
    port = 61225,
    define = [],
    plugins = [],
    fableCoreVersion = require('fable-core/package.json').version,
    fableCore = dirname(require.resolve('fable-core/package.json')),
    declaration = false,
    typedArrays = true,
    clampByteArrays = false,
    extra = undefined
  } = {}
) => ({
  path,
  port,
  define,
  plugins,
  fableCoreVersion,
  fableCore,
  declaration,
  typedArrays,
  clampByteArrays,
  extra
});
