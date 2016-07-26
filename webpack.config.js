var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var path = require('path');

// Webpack Config
var webpackConfig = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor':    './src/vendors.ts',
        'app':       './src/main.ts',
    },

    output: {
        path: './dist',
    },

    plugins: [
        // App
        new webpack.optimize.CommonsChunkPlugin({ name: ['app', 'vendor', 'polyfills'], minChunks: Infinity }),

        // Static assets
        new CopyWebpackPlugin([{ from: 'src/app', to: 'app' }]),

        // HTML
        new HtmlWebpackPlugin({ template: 'src/index.html', inject: false }),

        // jQuery & utils
        new webpack.ProvidePlugin({
            //jQuery: 'jquery',
            //$: 'jquery',
            //jquery: 'jquery',
            "window.jQuery": "jquery",
            "root.jQuery": "jquery",
            "elasticsearch": "elasticsearch",
            "markdown": "markdown",
            "Hammer": "hammerjs/hammer"
        }),

        // Favicons
        // new FaviconsWebpackPlugin('src/app/assets/images/icons/scvo.png')
    ],

    resolve: {
        alias: {
            materializecss: 'materialize-css/dist/css/materialize.css',
            materialize: 'materialize-css/dist/js/materialize.js',
        },
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.css', '.html', '.png', '.jpg']
    },

    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                // .ts files for TypeScript
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /materialize-css\/dist\/js\/materialize\.js/,
                loader: 'imports?materializecss'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                // .scss files for Sass
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader?sourceMap',
                exclude: /node_modules/
            },
            {
                // Match woff2 in addition to patterns like .woff?v=1.1.1.
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url',
                query: {
                    limit: 50000,
                    mimetype: 'application/font-woff',
                    name: './fonts/[hash].[ext]'
                }
            },
            {
                test: /\.ttf$|\.eot$|\.svg$/,
                loader: 'url',
                query: {
                    name: './fonts/[hash].[ext]'
                }
            }
        ]
    }
};

// Our Webpack Defaults
var defaultConfig = {
    devtool: 'cheap-module-source-map',
    cache: true,
    debug: true,
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    // these packages have problems with their sourcemaps
                    path.join(__dirname, 'node_modules', 'rxjs'),
                    path.join(__dirname, 'node_modules', '@angular2-material'),
                    path.join(__dirname, 'node_modules', '@angular'),
                ]
            }
        ],
        noParse: [
            path.join(__dirname, 'node_modules', 'zone.js', 'dist'),
            path.join(__dirname, 'node_modules', 'angular2', 'bundles')
        ]
    },

    resolve: {
        root: [ path.join(__dirname, 'src') ],
        extensions: ['', '.ts', '.js'],
        alias: {
            'angular2/testing': path.join(__dirname, 'node_modules', '@angular', 'core', 'testing.js'),
            '@angular/testing': path.join(__dirname, 'node_modules', '@angular', 'core', 'testing.js'),
            'angular2/core': path.join(__dirname, 'node_modules', '@angular', 'core', 'index.js'),
            'angular2/platform/browser': path.join(__dirname, 'node_modules', '@angular', 'platform-browser', 'index.js'),
            'angular2/testing': path.join(__dirname, 'node_modules', '@angular', 'testing', 'index.js'),
            'angular2/router': path.join(__dirname, 'node_modules', '@angular', 'router', 'index.js'),
            'angular2/http': path.join(__dirname, 'node_modules', '@angular', 'http', 'index.js'),
            'angular2/http/testing': path.join(__dirname, 'node_modules', '@angular', 'http', 'testing.js')
        },
    },

    devServer: {
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 300, poll: 1000 }
    },

    node: {
        global: 1,
        crypto: 'empty',
        module: 0,
        Buffer: 0,
        clearImmediate: 0,
        setImmediate: 0
    },
}

var webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);
