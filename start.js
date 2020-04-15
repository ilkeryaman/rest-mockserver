// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require("@babel/register")({
    presets: ["@babel/preset-env"],
    plugins: [
      "@babel/plugin-proposal-class-properties"
    ]
  });
  
  // Import the rest of mock-server application.
  module.exports = require('./src/server.js')