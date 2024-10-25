#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const bumpVersion = {
  patch: (v) => {
    return [
      v[0],
      v[1],
      v[2] + 1,
    ]
  },
  minor: (v) => {
    return [
      v[0],
      v[1] + 1,
      0,
    ]
  },
  major: (v) => {
    return [
      v[0] + 1,
      0,
      0,
    ]
  },
}

const [firstArg, secondArg] = process.argv.slice(2);

const scriptPath = secondArg || firstArg;
let bumpType = secondArg ? firstArg : 'patch';
bumpType = ['major', 'minor', 'patch'].includes(bumpType) ? bumpType : 'patch';
const metaFilePath = path.join(scriptPath, 'meta.js');
const versionFilePath = path.join(scriptPath, 'version.js');
const meta = fs.readFileSync(metaFilePath, 'utf8');
const oldVersion = meta.split('\n').find(line => line.includes('// @version')).split(' ').pop()

let versionArr = oldVersion.split('-')[0].split('.').map(v => parseInt(v));
let versionDate = (new Date()).toISOString().split('T')[0].replaceAll('-', '').slice(-6)

versionArr = bumpVersion[bumpType](versionArr)

let newVersion = `${versionArr.join('.')}-${versionDate}`;
let versionFileContent = `GM_info.script.version = '${newVersion}';\n`

fs.writeFileSync(metaFilePath, meta.replace(oldVersion, newVersion))

fs.existsSync(versionFilePath) && fs.writeFileSync(versionFilePath, versionFileContent)

console.log('from:', oldVersion)
console.log('..to:', newVersion)
