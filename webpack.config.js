const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const isProduction = 'production' === process.env.NODE_ENV;
const { entryPoints } = require( './pluginMachine.json' );

let entry = {};
if ( entryPoints.hasOwnProperty( 'blocks' ) ) {
	entryPoints.blocks.forEach( ( entryPoint ) => {
		entry[ `block-${ entryPoint }` ] = path.resolve(
			process.cwd(),
			`blocks/${ entryPoint }/index.js`
		);
	} );
}

entry[`./assets/js/blocks.three-custom-block`] = "./blocks/three-custom-block/three-custom-block-front.js";

module.exports = {
	mode: isProduction ? 'production' : 'development',
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{ 
				test: /\.js$/, loader: "babel-loader"
			},		  
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ],
			},
			// {
            //     test: /\.glsl$/,
            //     use: 'webpack-glsl',
			// },
			// {
			// 	test: /\.(vert|frag)$/i,
			// 	use: 'raw-loader',			  
			// },
			{
				test: /\.(glsl|frag|vert)$/,
				use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ['file-loader', 'url-loader']			
			},
			{
				test: /\.vrm$/,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
			],
	},
	entry,
	output: {
		filename: '[name].js',
		path: path.join( __dirname, './build' ),
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
};
