const { relative } = require('path');
const crypto = require('crypto');
const fs = require('fs');
const babel = require('babel-core');
const findBabelConfig = require('find-babel-config');
const babelPlugins = require('fable-utils/babel-plugins');
const fableUtils = require('fable-utils');
const istanbulPlugin = require('babel-plugin-istanbul').default;
const hoistPlugin = require('babel-plugin-jest-hoist');
const glob = require('glob');

const send = require('./client.js');
const parseOpts = require('./parse-opts.js');

const { file: babelFile, config } = findBabelConfig.sync('./');

const babelOpts = fableUtils.resolveBabelOptions(
  Object.assign({ plugins: [], presets: [] }, config)
);

babelOpts.plugins = [
  babelPlugins.getRemoveUnneededNulls(),
  babelPlugins.getTransformMacroExpressions(babel.template),
  hoistPlugin()
].concat(babelOpts.plugins);

babelOpts.presets = [].concat(babelOpts.presets);

const THIS_FILE = fs.readFileSync(__filename);
const BABEL_FILE = babelFile ? fs.readFileSync(babelFile) : '';

fableUtils.validateFableOptions(babelOpts);

module.exports = {
  canInstrument: true,
  getCacheKey(fileData, filename, configString, { instrument, rootDir }) {
    return crypto
      .createHash('md5')
      .update(THIS_FILE)
      .update('\0', 'utf8')
      .update(fileData)
      .update('\0', 'utf8')
      .update(relative(rootDir, filename))
      .update(configString)
      .update('\0', 'utf8')
      .update(BABEL_FILE)
      .update('\0', 'utf8')
      .update(instrument ? 'instrument' : '')
      .digest('hex');
  },
  process(src, path, config, transformOptions) {
    if (!path.endsWith('.fs') && !path.endsWith('.fsx')) return src;

    const projectFile =
      glob.sync(`${config.rootDir}/test/*.fsproj`)[0] ||
      glob.sync(`${config.rootDir}/*.fsproj`)[0];

    if (!projectFile) throw new Error('Could not find project file.');

    const fableJest = {
      extra: {
        projectFile
      }
    };

    const resp = send(parseOpts(path, fableJest));

    const data = JSON.parse(resp.stdout);

    const { fileName, error = null } = data;

    if (error) throw new Error(error);

    const { error: errors = [], infos = [], warnings = [] } = data.logs;

    // eslint-disable-next-line no-console
    infos.forEach(console.log);
    // eslint-disable-next-line no-console
    warnings.forEach(console.error);
    // eslint-disable-next-line no-console
    errors.forEach(console.error);

    if (errors.length) throw new Error(errors);

    const theseOptions = Object.assign({}, babelOpts, {
      filename: path,
      sourceMaps: true,
      sourceFileName: relative(process.cwd(), fileName.replace(/\\/g, '/'))
    });

    if (transformOptions && transformOptions.instrument) {
      theseOptions.auxiliaryCommentBefore = ' istanbul ignore next ';
      // Copied from jest-runtime transform.js
      theseOptions.plugins = theseOptions.plugins.concat([
        [
          istanbulPlugin,
          {
            // files outside `cwd` will not be instrumented
            cwd: config.rootDir,
            exclude: ['**/packages/*', '*.test.fs', '*Test.fs']
          }
        ]
      ]);
    }

    return babel.transformFromAst(data, src, theseOptions);
  }
};
