function _$_variableSameNameDependency_main() { let x = _$_variableSameNameDependency_dependency; return function (dep) { return x() + dep; }; }
function _$_variableSameNameDependency_dependency() {}
_$_variableSameNameDependency_main;
/*"main" metadata:    {
      globals: [],
      localBindingNames: [],
      dependencies: new Map([["dep","_$_variable-same-name-dependency_dependency"]]),
      exportBindingAssignments: [],
      exportPath: "body.1",
      exportName: "helper",
      importBindingsReferences: ["body.1.declaration.body.body.0.declarations.0.init"],
      importPaths: ["body.0"],
    }
  */
