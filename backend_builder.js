const webpack = require('webpack');
const path = require('path');

var externals = require('webpack-node-externals')


var config = {
    entry: './index.js',
    target: 'node',
    output: {
      path: path.join(__dirname),
      filename: './backend.js'
    },
    externals: [externals()]
  };

  webpack(config, (err, stats) => {
    console.log('server build complete');
  });