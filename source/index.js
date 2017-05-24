const { relative } = require('path');
const crypto = require('crypto');
const fs = require('fs');
const babel = require('babel-core');
const findBabelConfig = require('find-babel-config');
const chalk = require('chalk');
const babelPlugins = require('fable-utils/babel-plugins');
const istanbulPlugin = require('babel-plugin-istanbul').default;
const hoistPlugin = require('babel-plugin-jest-hoist');

const send = require('./client.js');
const parseOpts = require('./parse-opts.js');

const {
  file: babelFile,
  config: babelOpts = { plugins: [] }
} = findBabelConfig.sync('./');

babelOpts.plugins = [
  babelPlugins.getRemoveUnneededNulls(),
  babelPlugins.getTransformMacroExpressions(babel.template),
  hoistPlugin
].concat(babelOpts.plugins || []);

const THIS_FILE = fs.readFileSync(__filename);
const BABEL_FILE = babelFile ? fs.readFileSync(babelFile) : '';

module.exports = {
  canInstrument: true,
  getCacheKey(fileData, filename, configString, { instrument }) {
    return crypto
      .createHash('md5')
      .update(THIS_FILE)
      .update('\0', 'utf8')
      .update(fileData)
      .update('\0', 'utf8')
      .update(configString)
      .update('\0', 'utf8')
      .update(BABEL_FILE)
      .update('\0', 'utf8')
      .update(instrument ? 'instrument' : '')
      .digest('hex');
  },
  process(src, path, config, transformOptions) {
    if (!path.endsWith('.fs') && !path.endsWith('.fsx')) return src;

    const { fable = {} } = require(`${config.rootDir}/package.json`);
    const resp = send(parseOpts(path, fable));

    const data = JSON.parse(resp.stdout);

    const { error = null, infos = [], warnings = [], fileName } = data;

    chalk.red(error);

    if (error) throw new Error(error);

    infos.forEach(chalk.blue);
    warnings.forEach(chalk.yellow);

    const theseOptions = Object.assign(
      {
        filename: path,
        sourceMaps: true,
        sourceFileName: relative(process.cwd(), fileName.replace(/\\/g, '/'))
      },
      babelOpts
    );

    if (transformOptions && transformOptions.instrument) {
      theseOptions.auxiliaryCommentBefore = ' istanbul ignore next ';
      // Copied from jest-runtime transform.js
      theseOptions.plugins = theseOptions.plugins.concat([
        [
          istanbulPlugin,
          {
            // files outside `cwd` will not be instrumented
            cwd: config.rootDir,
            exclude: []
          }
        ]
      ]);
    }

    return babel.transformFromAst(data, src, theseOptions).code;
  }
};
