const path = require('path');
module.exports = {
	entry: './src/lib/Search.js',
	output: {
	path: path.resolve(__dirname, './src/dist'),
	filename: 'search-browser.min.js',
    library: 'archiveSearch',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|bower_components|build)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	target: 'web',
	node: {
		console: true,
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};
