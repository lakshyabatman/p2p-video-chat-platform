const path = require('path');

module.exports = {
  entry: './src/public/js/client.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'src/public/dist/js'),
  },
};