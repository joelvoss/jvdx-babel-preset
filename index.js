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
		assumptions: options['assumptions'],
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
			!isModern &&
				!isNodeTarget && [
					require.resolve('@babel/plugin-transform-regenerator'),
					{ async: false },
				],
			[require.resolve('babel-plugin-macros')],
		].filter(Boolean),
	};
};
