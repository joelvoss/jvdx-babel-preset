const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';

module.exports = (api, options = {}) => {
	const isModern = Boolean(api.caller(caller => !!caller && caller.isModern));
	const isTypescript = Boolean(
		api.caller(caller => !!caller && caller.isTypescript),
	);

	const presetEnvConfig = {
		// In the test environment `modules` is often needed to be set to true,
		// babel figures that out by itself using the `'auto'` option.
		modules: 'auto',
		targets: isModern ? { esmodules: true } : null,
		loose: true,
		useBuiltIns: false,
		bugfixes: isModern,
		exclude: [
			'transform-typeof-symbol',
			'transform-async-to-generator',
			'transform-regenerator',
		],
		...options['preset-env'],
	};

	const isNodeTarget =
		presetEnvConfig.targets && presetEnvConfig.targets.node != null;

	return {
		sourceType: 'unambiguous',
		presets: [
			[require.resolve('@babel/preset-env'), presetEnvConfig],
			[
				require.resolve('@babel/preset-react'),
				{
					// This adds @babel/plugin-transform-react-jsx-source and
					// @babel/plugin-transform-react-jsx-self automatically in development
					development: isDevelopment,
					runtime: 'automatic',
					...options['preset-react'],
				},
			],
			[
				require.resolve('@babel/preset-typescript'),
				{ allowNamespaces: true, ...options['preset-typescript'] },
			],
		],
		plugins: [
			[require.resolve('@babel/plugin-syntax-import-meta')],
			[
				require.resolve('./plugins/optimize-hook-destructuring'),
				{
					// Only optimize hook functions imported from React/Preact
					lib: true,
				},
			],
			!isTypescript && [
				require.resolve('@babel/plugin-transform-flow-strip-types'),
			],
			!isModern &&
				!isNodeTarget && [
					require.resolve('babel-plugin-transform-async-to-promises'),
					{
						inlineHelpers: true,
						externalHelpers: false,
						minify: true,
					},
				],
			!isModern &&
				!isNodeTarget && [
					require.resolve('./plugins/transform-fast-rest'),
					{
						// Use inline [].slice.call(arguments)
						helper: false,
						literal: true,
					},
				],
			[
				require.resolve('@babel/plugin-proposal-class-properties'),
				{ loose: true, ...options['class-properties'] },
			],
			// Though the "loose" option was set to "true" in our @babel/preset-env 
			// config, it will not be used for @babel/plugin-proposal-private-methods 
			// since the "loose" mode option was set to "false" for
			// @babel/plugin-proposal-class-properties.
			// The "loose" option must be the same for:
			// * @babel/Plugin-proposal-class-properties 
			// * @babel/plugin-proposal-private-methods
			// * @babel/plugin-proposal-private-property-in-object
			[
				require.resolve('@babel/plugin-proposal-private-methods'),
				{ loose: true, ...options['private-methods'] }
			],
			!isModern &&
				!isNodeTarget && [
					require.resolve('@babel/plugin-transform-regenerator'),
					{ async: false },
				],
			// Typescript supports optional chaining and nullish coaliescing by
			// default
			!isTypescript && [
				require.resolve('@babel/plugin-proposal-optional-chaining'),
			],
			!isTypescript && [
				require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
			],
			[require.resolve('babel-plugin-macros')],
		].filter(Boolean),
	};
};
