#!/usr/bin/env node

const send = require('./client.js');
const parseOpts = require('./parse-opts.js');
const { join } = require('path');

const path = join(process.cwd(), '/test/Test.fsproj');
send(parseOpts(path));
