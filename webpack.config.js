const path = require('path');

/** @type {import('webpack').Configuration} */
const extensionConfig = {
    mode: 'none',
    target: 'node',
    entry: {
        extension: './src/extension.ts'
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].js',
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../../[resource-path]'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    externals: {
        vscode: 'commonjs vscode'
    },
    devtool: 'nosources-source-map'
};

/** @type {import('webpack').Configuration} */
const webviewConfig = {
    mode: 'none',
    target: 'web',
    entry: {
        webview: './src/webview/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].js',
        devtoolModuleFilenameTemplate: '../../[resource-path]'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        conditionNames: ['import', 'require', 'node'],
        fallback: {
            "path": require.resolve("path-browserify"),
            "process": require.resolve("process/browser"),
            "url": require.resolve("url/")
        },
        alias: {
            "node:path": "path-browserify",
            "node:process": "process/browser",
            "node:url": path.resolve(__dirname, 'url-shim.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devtool: 'nosources-source-map',
    plugins: [
        new (require('webpack').DefinePlugin)({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new (require('webpack').NormalModuleReplacementPlugin)(
            /^node:/,
            (resource) => {
                const mod = resource.request.replace(/^node:/, '');
                if (mod === 'url') {
                    resource.request = path.resolve(__dirname, 'url-shim.js');
                } else {
                    resource.request = mod;
                }
            }
        )
    ]
};

module.exports = [extensionConfig, webviewConfig];
