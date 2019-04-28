const path = require('path');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  mode: 'development',
  entry: ['./src/scripts/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: [/node_modules/, nodeModulesPath],
      },
    ],
  },
};
