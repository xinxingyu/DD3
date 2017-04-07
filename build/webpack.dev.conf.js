var path = require('path')
var webpack = require('webpack')
var utils = require('./utils')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve (dir) {
	return path.join(__dirname, '..', dir)
}

/**
 * entrys of webpack
 */
var entry = utils.getAppEntry('./demo/**/*.js', '')

// for (var key in entry) {
// 	entry[key].push('webpack-hot-middleware/client?noInfo=true&reload=true');
// }

module.exports = {
	entry: entry,
	// devtool: "source-map",
    output: {
        // library: 'dd3',
        path: path.resolve(__dirname, '../dist'),
		publicPath: '/',
        filename: '[name].js'
    },
	resolve: {
		extensions: ['.js', '.json'],
		modules: [
			resolve('src'),
			resolve('node_modules')
		],
		alias: {
			'src': resolve('src'),
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
		        loader: 'babel-loader',
		        include: [resolve('src'), resolve('demo'), resolve('test')]
			}
		]
	},
	plugins: [
		// new webpack.HotModuleReplacementPlugin(),
		// new webpack.NoEmitOnErrorsPlugin(),
		// new FriendlyErrorsPlugin()
	]
};
