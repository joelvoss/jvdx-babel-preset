# @jvdx/babel-preset

jvdx's babel preset. It includes the following presets and plugins:

**Plugins**
- proposal-class-properties
- proposal-nullish-coalescing-operator
- proposal-optional-chaining
- syntax-import-meta
- transform-flow-strip-types
- transform-regenerator
- macros
- transform-async-to-promises

**Presets**
- env
- react
- typescript

## Installation

(1) Install this preset as well as its peer dependencies:

```bash
# Using npm
$ npm i -D @babel/core @jvdx/babel-preset

# Using yarn
$ yarn add -D @babel/core @jvdx/babel-preset
```

(2) Configure babel:

```json
// babel.config.js
{
	"babel": {
		"presets": ["@jvdx/babel-preset"]
	}
}
```

## Configuration

To configure the included presets/plugins, do not add them to presets or
plugins in your custom babel configuration. Instead, configure them on the
`@jvdx/babel-preset` preset, like so:

```json
{
	"babel": {
		"presets": [
			[
				"@jvdx/babel-preset",
				{
					"preset-react": {},
					"preset-typescript": {},
					"class-properties": {}
				}
			]
		],
	}
}
```

> Notice: To learn more about the available options for each config, visit
> their documentation site.
