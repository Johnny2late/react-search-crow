const path = require("path")
const TerserPlugin = require('terser-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (_env, argv) => {
    const watchMode = argv.liveReload || false

    const optimizations = {
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    }

    return {
        devServer: {
            compress: true,
            port: 3000,
            hot: true,
            open: true,
            historyApiFallback: true,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            alias: {
                searchCrow: path.join(__dirname, "./src/searchCrow/"),
            },
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: ["ts-loader"],
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    use: ["style-loader", "css-loader"]
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new WebpackNotifierPlugin({ alwaysNotify: false }),
        ],
        entry: ['./src/searchCrow'],
        output: {
            filename: watchMode ? '[name].js' : 'react-search-crow.js',
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
        },
        performance: {
            hints: false,
        },
        optimization: optimizations,
    }
}