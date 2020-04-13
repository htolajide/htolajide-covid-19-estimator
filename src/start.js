// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require("@babel/register")({
    presets: ["@babel/preset-env"]
  });
  // this help to resolve the import problems
  // npm install @babel/core @babel/register @babel/preset-env --save-dev
  // Import the rest of our application.
  module.exports = require('./app.js')