# @jvdx/babel-preset-jvdx

jvdx's babel preset. The `@jvdx/babel-preset-jvdx` preset includes:

  - plugin-proposal-class-properties
  - plugin-proposal-nullish-coalescing-operator
  - plugin-proposal-numeric-separator
  - plugin-proposal-object-rest-spread
  - plugin-proposal-optional-chaining
  - plugin-syntax-bigint
  - plugin-syntax-dynamic-import
  - plugin-transform-runtime
  - plugin-transform-react-remove-prop-types
  - preset-env
  - preset-react
  - preset-typescript

## Installation

(1) Install this preset as well as its peer dependencies:

```bash
# Using npm
$ npm i -D @babel/core @jvdx/babel-preset-jvdx

# Using yarn
$ yarn add -D @babel/core @jvdx/babel-preset-jvdx
```

(2) Configure babel in your `package.json`:

```json
{
  "babel": {
    "presets": [
      "@jvdx/babel-preset-jvdx"
    ],
    "plugins": []
  }
}
```

## Configuration

To configure the included presets/plugins, do not add them to presets or
plugins in your custom `.babelrc`. Instead, configure them on the
`@jvdx/babel-preset-jvdx` preset, like so:

```json
{
  "babel": {
    "presets": [
      ["@jvdx/babel-preset-jvdx", {
        "preset-env": {},
        "experimental-modern-preset": {},
        "preset-react": {},
        "preset-typescript": {},
        "class-properties": {},
        "transform-runtime": {},
      }]
    ],
    "plugins": []
  }
}
```

> Notice: To learn more about the available options for each config, visit
> their documentation site.