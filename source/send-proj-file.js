#!/usr/bin/env node

const send = require('./client.js');
const parseOpts = require('./parse-opts.js');
const {
  fable = { projLocation: './test/Test.fsproj' }
} = require(`${process.cwd()}/package.json`);
const resp = send(parseOpts(fable.projLocation));

const parsedResp = JSON.parse(resp.stdout);

if (parsedResp.logs.error) {
  // eslint-disable-next-line no-console
  parsedResp.logs.error.forEach(x => console.error(x));

  process.exit(1);
}
