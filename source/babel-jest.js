const createTransformer = require('babel-jest').createTransformer;
const fableUtils = require('fable-utils');
const findBabelConfig = require('find-babel-config');

const { config } = findBabelConfig.sync('./');
const opts = fableUtils.resolveBabelOptions(config);

fableUtils.validateFableOptions(opts);

module.exports = createTransformer(opts);
