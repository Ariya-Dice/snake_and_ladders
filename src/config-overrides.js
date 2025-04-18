// config-overrides.js
const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "url": require.resolve("url/"),
            "assert": require.resolve("assert/"),
            "util": require.resolve("util/")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
};