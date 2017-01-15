const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.initConfig({
        handlebars: {
            compile: {
                options: {
                    namespace: false,
                    commonjs : true
                },
                files: {
                    './src/handlebars/compiled/resultCorrect.js': './src/handlebars/resultCorrect.handlebars',
                    './src/handlebars/compiled/resultWrong.js': './src/handlebars/resultWrong.handlebars'
                }
            }
        },
        clean: ['public/de.html'],
        'compile-handlebars': {
            de: {
                files: [{
                    src: './src/handlebars/main.handlebars',
                    dest: './public/de.html'
                }],
                templateData: require('./content/de.js'),
                partials: './src/handlebars/*.handlebars'
            }
        },
        watch: {
            compile: {
                files: [
                    './src/handlebars/**/*.handlebars',
                    './content/**/*.*'
                ],
                tasks: ['handlebars', 'compile'],
                options: {
                    spawn: true
                }
            },
            webpack: {
                files: [
                    './src/scss/**/*.scss',
                    './src/js/**/*.js'
                ],
                tasks: ['webpack'],
                options: {
                    spawn: false
                }
            }
        },
        webpack: {
            dev: {
                entry: [
                    './src/js/main.js',
                    './src/scss/main.scss'
                ],
                output: {
                    path: './public/',
                    filename: 'js/module.js'
                },
                plugins: [
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin(),
                    new ExtractTextPlugin('style.css', {
                        allChunks: true
                    })
                ],
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['es2017', 'es2015']
                            }
                        },
                        {
                            test: /\.scss$/,
                            loader: ExtractTextPlugin.extract('css!sass')
                        },
                        {
                            test: /\.(png|gif)$/,
                            loader: 'url-loader'
                        },
                        {
                            test: /\.(eot|svg|ttf|woff|woff2)$/,
                            loader: 'file?name=fonts/[name].[ext]'
                        }
                    ]
                },
                stats: {
                    colors: false,
                    modules: false,
                    reasons: true
                },
                progress: false,
                failOnError: false,
                watch: false,
                keepalive: false
            }
        }
    });

    grunt.registerTask('compile', ['clean', 'handlebars', 'compile-handlebars']);
    grunt.registerTask('default', ['compile', 'webpack', 'watch']);
};