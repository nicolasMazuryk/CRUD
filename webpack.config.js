'use strict';

var NODE_ENV = process.env.NODE_ENV || 'development',
       webpack = require( 'webpack'),
        ExtractTextPlugin = require('extract-text-webpack-plugin');

//module.exports = [ { }, { }, { } ]; // multi-compilation (for old browsers etc)

module.exports = {
    context: __dirname + '/app/component',
    entry: {
        main: './main',
        styles: './styles'
    },
        //home: './home',
        //about: './about',
        //common: ['./test', './common'] // the last module will be exported to global var
    output: {
        path: __dirname + "/dist",
        publicPath: '/',    // internet path to static files (http://static.mysite.com/js/) "/" in the end - important
        filename: "[name].js"
        //library: '[name]'
    },

    watch: NODE_ENV == 'development',
    watchOptions: {
        aggregateTimeout: 100
    },

    //devtool: NODE_ENV == 'development' ? 'source-map' : null,

    plugins: [
        new ExtractTextPlugin('[name].css', { allChunks: true })
        //new webpack.DefinePlugin({
        //    NODE_ENV: JSON.stringify(NODE_ENV),
        //    LANG: JSON.stringify('ru')
        //}),
        //new webpack.NoErrorsPlugin(),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'common',
        //    minChunks: 2,
        //    chunks: ['about', 'home']
        //})
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'common-goods',
        //    chunks: ['shop', 'order']
        //})
    ],

    resolve: {
        //modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.less']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader'],
        extensions: ['', '.js']
    },

    module: {
        loaders: [{
            test: /\.js$/,
            //include: [
            //    path.resolve(__dirname, '')
            //],
            //loader: 'babel?presets[]=es2015'
            loader: 'babel?optional[]=runtime'
        }, {
            test: /\.jade$/,
            loader: 'jade'
        },
        //    {
        //    test: /\.css$/,
        //    loader: 'style!css!autoprefixer?browsers=last 2 versions'
        //},
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css!autoprefixer!less') // styles -> will invoke if css remain in js
            }
            //{
            //test: /\.less$/,
            //loader: 'style!css!autoprefixer?browsers=last 2 versions!less'
            //}
            , {
            test: /\.(png|svg|jpg|ttf|eot|woff|woff2)$/,
            include: /\/node_modules\//,
            loader: 'file?name=[1].[ext]&regExp=node_modules/(.*)'
        }, {
            test: /\.(png|svg|jpg|ttf|eot|woff|woff2)$/,
            exclude: /\/node_modules\//,
            loader: 'file?name=[path][name].[ext]'
        }]
    }
};


if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    )
}


// rm dist/*.js.map
// static dist/
// NODE_ENV=production webpack
// webpack --display-modules -v
// webpack --json --profile >stats.json     webpack.github.io/analyse