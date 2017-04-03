const { relative } = require('path');
const crypto = require('crypto');
const fs = require('fs');
const babel = require('babel-core');
const findBabelConfig = require('find-babel-config');
const chalk = require('chalk');
const babelPlugins = require('fable-loader/src/babel-plugins.js');

const send = require('./client.js');
const parseOpts = require('./parse-opts.js');

const {
  file: babelFile,
  config: babelOpts = { plugins: [] }
} = findBabelConfig.sync('./');

babelOpts.plugins = [
  babelPlugins.transformMacroExpressions,
  babelPlugins.removeUnneededNulls
].concat(babelOpts.plugins);

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
  process(src, path, config) {
    if (!path.endsWith('.fs') && !path.endsWith('.fsx')) return src;

    const { fable = {} } = require(`${config.rootDir}/package.json`);
    const resp = send(parseOpts(path, fable));

    const data = JSON.parse(resp.stdout);

    const {
      error = null,
      infos = [],
      warnings = [],
      fileName
    } = data;

    if (error) throw new Error(error);

    infos.forEach(chalk.blue);
    warnings.forEach(chalk.yellow);

    let fsCode = null;

    if (babelOpts.sourceMaps) {
      fsCode = src;
      babelOpts.sourceMaps = true;
      babelOpts.sourceFileName = relative(
        process.cwd(),
        fileName.replace(/\\/g, '/')
      );
    }

    return babel.transformFromAst(data, fsCode, babelOpts).code;
  }
};
