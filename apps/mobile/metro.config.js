// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { fileURLToPath } = require("url"); // the node package 'url'

function dirname(meta) {
  return fileURLToPath(meta.url);
}

// call with import.meta
const __dirname = dirname(import.meta);


/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

module.exports = config;
