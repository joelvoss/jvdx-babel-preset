// Matches any hook-like (the default)
const isHook = /^use[A-Z]/;

// Matches only built-in hooks provided by React et al
const isBuiltInHook = /^use(Callback|Context|DebugValue|Effect|ImperativeHandle|LayoutEffect|Memo|Reducer|Ref|State)$/;

module.exports = function ({ types: t }) {
  const visitor = {
    CallExpression(path, state) {
      const onlyBuiltIns = state.opts.onlyBuiltIns;

      // If specified, options.lib is a list of libraries that provide hook 
      // functions
      const libs =
        state.opts.lib &&
        (state.opts.lib === true
          ? ["react", "preact/hooks"]
          : [].concat(state.opts.lib));

      // Skip function calls that are not the init of a variable declaration:
      if (!t.isVariableDeclarator(path.parent)) return;

      // Skip function calls where the return value is not Array-destructured:
      if (!t.isArrayPattern(path.parent.id)) return;

      // Name of the (hook) function being called:
      const hookName = path.node.callee.name;

      if (libs) {
        const binding = path.scope.getBinding(hookName);
        // Not an import
        if (!binding || binding.kind !== "module") return;

        const specifier = binding.path.parent.source.value;
        // Not a match
        if (!libs.some((lib) => lib === specifier)) return;
      }

      // Only match function calls with names that look like a hook
      if (!(onlyBuiltIns ? isBuiltInHook : isHook).test(hookName)) return;

      path.parent.id = t.objectPattern(
        path.parent.id.elements.reduce((patterns, element, i) => {
          if (element === null) {
            return patterns;
          }

          return patterns.concat(
            t.objectProperty(t.numericLiteral(i), element)
          );
        }, [])
      );
    },
  };

  return {
    name: "optimize-hook-destructuring",
    visitor: {
      // This is a workaround to run before preset-env destroys destructured 
      // assignments
      Program(path, state) {
        path.traverse(visitor, state);
      },
    },
  };
}
