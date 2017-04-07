var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var glob = require('glob')

function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname, basename));
        pathDir = path.normalize(pathDir);
        if (pathname.startsWith(pathDir)) {
            pathname = pathname.substring(pathDir.length)
        }
        entries[pathname] = ['./' + entry];
    }
    return entries;
}


exports.outputTemplates = function () {
    var pages = Object.keys(getEntry('templates/**/*.html', 'templates/'));
    var plugins = [];
    pages.forEach(function (pathname) {
        var conf = {
            filename: 'templates/' + pathname + '.html', //生成的html存放路径，相对于path
            template: 'templates/' + pathname + '.html', //html模板路径
            inject: false, //js插入的位置，true/'head'/'body'/false
            /*
             * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
             * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
             * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
             * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
             */
            // minify: { //压缩HTML文件
            // 	removeComments: true, //移除HTML中的注释
            // 	collapseWhitespace: false //删除空白符与换行符
            // }
        };
        if (pathname.indexOf('/') == -1) {
            // conf.favicon = path.resolve(__dirname, 'src/imgs/favicon.ico');
            conf.inject = 'body';
            conf.chunks = ['vendor', 'lyt', pathname + '_main'];
            conf.chunksSortMode = 'dependency';
            // conf.hash = true;
        }
        plugins.push(new HtmlWebpackPlugin(conf));
    });
    return plugins;
}

exports.getAppEntry = function (globPath, alias) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname, basename));
		//entry's name
		entryName = pathname.split('/')[1];
        entries[entryName + alias] = [entry];
    }
    return entries;
}
