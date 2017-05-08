var path = require('path');

module.exports = {
    entry: './benchmark/benchmark.js',
    output: {
        path: path.resolve(__dirname, '../benchmark'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: ['babili']
                }
            }]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, "../benchmark"),
        compress: true,
        port: 9001
    }
}