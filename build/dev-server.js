var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var exec = require('child_process').exec;
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

var app = express()
var compiler = webpack(webpackConfig)

//you can modify to you want
var port = 8011;


var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	quiet: true
})
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({ action: 'reload' })
		cb()
	})
})

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

execWebpack();

function execWebpack() {
	exec(
		'webpack --config build/webpack.dev.conf.js --progress --hide-modules',
		function (err, stdout, stderr) {
			if (err) {
				console.error(stderr);
			} else {
				console.log(stdout);
			}
		});
}


var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
	console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err)
		return
	}
})
