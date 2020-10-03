const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';
const isTest = env === 'test';

module.exports = (api, options = {}) => {
  const isModern = api.caller((caller) => !!caller && caller.isModern)
  const hasJsxRuntime = Boolean(
    api.caller((caller) => !!caller && caller.hasJsxRuntime)
  )

	const isLaxModern =
		isModern ||
		(options['preset-env'] &&
			options['preset-env'].targets &&
			options['preset-env'].targets.esmodules === true);

		const presetEnvConfig = {
			// In the test environment `modules` is often needed to be set to true,
			// babel figures that out by itself using the `'auto'` option.
			modules: 'auto',
			targets: isLaxModern ? { esmodules: true } : null,
			loose: true,
			useBuiltIns: false,
			bugfixes: isLaxModern,
			exclude: [
				'transform-typeof-symbol',
				'transform-async-to-generator',
				'transform-regenerator',
			],
			...options['preset-env'],
		};

	// When transpiling for tests, target the current Node version if not
	// explicitly specified
	if (
		isTest &&
		(!presetEnvConfig.targets ||
			!(
				typeof presetEnvConfig.targets === 'object' &&
				'node' in presetEnvConfig.targets
			))
	) {
		presetEnvConfig.targets = {
			// Targets the current process' version of Node. This requires apps be
			// built and deployed on the same version of Node.
			node: 'current',
		};
	}

	// specify a preset to use instead of @babel/preset-env
	const customModernPreset =
		isLaxModern && [require('@babel/preset-modules')];

	return {
		sourceType: 'unambiguous',
		presets: [
			customModernPreset || [
				require('@babel/preset-env').default,
				presetEnvConfig,
			],
			[
				require('@babel/preset-react'),
				{
					// This adds @babel/plugin-transform-react-jsx-source and
					// @babel/plugin-transform-react-jsx-self automatically in development
					development: isDevelopment || isTest,
					...(hasJsxRuntime ? { runtime: 'automatic' } : { pragma: '__jsx' }),
					...options['preset-react'],
				},
			],
			[
				require('@babel/preset-typescript'),
				{ allowNamespaces: true, ...options['preset-typescript'] },
			],
		],
		plugins: [
			[
				require('./plugins/optimize-hook-destructuring'),
				{
					// Only optimize hook functions imported from React/Preact
					lib: true,
				},
			],
			require('@babel/plugin-syntax-import-meta'),
			[
				require('@babel/plugin-proposal-class-properties'),
				options['class-properties'] || { loose: true },
			],
			[
				require('./plugins/transform-fast-rest'),
				{
					// Use inline [].slice.call(arguments)
					helper: false,
					literal: true,
				},
			],
			require('babel-plugin-macros'),
			require('@babel/plugin-proposal-optional-chaining'),
			require('@babel/plugin-proposal-nullish-coalescing-operator'),
		].filter(Boolean),
	};
};
