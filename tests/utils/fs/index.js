'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const crypto = require('crypto');
const YAML = require('js-yaml');
const JSZip = require('jszip');

const tmpDirCommonPath = path.join(os.tmpdir(), 'tmpdirs-serverless');

function getTmpDirPath() {
  return path.join(tmpDirCommonPath, crypto.randomBytes(8).toString('hex'));
}

function getTmpFilePath(fileName) {
  return path.join(getTmpDirPath(), fileName);
}

function createFile(name, content) {
  const filePath = getTmpFilePath(name);
  fse.ensureFileSync(filePath, content);
  return filePath;
}

function replaceTextInFile(filePath, subString, newSubString) {
  const fileContent = fs.readFileSync(filePath).toString();
  fs.writeFileSync(filePath, fileContent.replace(subString, newSubString));
}

function readYamlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return YAML.safeLoad(content);
}

function writeYamlFile(filePath, content) {
  const yaml = YAML.safeDump(content);
  fs.writeFileSync(filePath, yaml);
  return yaml;
}

function listZipFiles(filename) {
  return new JSZip().loadAsync(fs.readFileSync(filename))
    .then(zip => Object.keys(zip.files));
}

module.exports = {
  tmpDirCommonPath,
  getTmpDirPath,
  getTmpFilePath,
  createFile,
  replaceTextInFile,
  readYamlFile,
  writeYamlFile,
  listZipFiles,
};
