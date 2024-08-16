// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const path = require("path")
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const TerserPlugin = require('terser-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const WebpackNotifierPlugin = require('webpack-notifier')
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// eslint-disable-next-line no-undef
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
            alias: {// eslint-disable-next-line no-undef
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
        entry: ['./src'],
        output: {
            filename: watchMode ? '[name].js' : 'react-search-crow.js',
            // eslint-disable-next-line no-undef
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
        },
        performance: {
            hints: false,
        },
        optimization: optimizations,
    }
}