const webpack = require('webpack');
const path = require('path');

var config = {
    entry: './index.js',
    target: 'node',
    output: {
      path: path.join(__dirname),
      filename: './backend.js'
    },
    externals: {
      knex: 'commonjs knex',
      "socket.io": 'commonjs socket.io'
    }
  };

  webpack(config, (err, stats) => {
    console.log('server build complete');
  });