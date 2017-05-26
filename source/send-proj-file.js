#!/usr/bin/env node

const send = require('./client.js');
const parseOpts = require('./parse-opts.js');
const {
  fable = { projLocation: './test/Test.fsproj' }
} = require(`${process.cwd()}/package.json`);
const resp = send(parseOpts(fable.projLocation));

const { logs = {} } = JSON.parse(resp.stdout);

// eslint-disable-next-line no-console
if (logs.error) logs.error.forEach(x => console.error(x));

if (logs.error.length) process.exit(1);
