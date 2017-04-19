#!/usr/bin/env node

const send = require('./client.js');
const parseOpts = require('./parse-opts.js');
const {
  fable = { projLocation: './test/Test.fsproj' }
} = require(`${process.cwd()}/package.json`);
const resp = send(parseOpts(fable.projLocation));

const { error = null } = JSON.parse(resp.stdout);

if (error) process.exit(1);
