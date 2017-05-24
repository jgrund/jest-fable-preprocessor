module.exports = (
  path,
  {
    port = process.env.FABLE_SERVER_PORT
      ? parseInt(process.env.FABLE_SERVER_PORT, 10)
      : 61225,
    define = [],
    plugins = [],
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
  declaration,
  typedArrays,
  clampByteArrays,
  extra
});
