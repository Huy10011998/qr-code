const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = env => {
  return {
    mode: env,
    entry: './app.js',
    target: 'node',
    output: {
      filename: 'server.min.js',
      path: path.resolve(__dirname, 'build')
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }]
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()],
  }
};
