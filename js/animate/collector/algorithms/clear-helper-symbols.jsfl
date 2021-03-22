(function() {

  var helperSymbols = [
    'export all'
  ];

  function clearHelperSymbols() {
    var i = this.components.length - 1,
        len = 0,
        helpers = KT.RegExp(helperSymbols, true, 'gi'),
        child;
    for(; i >= len; i--) {
      child = this.components[i];
      if(child.get('id').match(helpers)) {
        this.components.splice(i, 1)
      }
    }
  }
  
  
  
  var ClearHelperSymbols = function(){}
  ClearHelperSymbols.default = clearHelperSymbols;

  KT.Algorithm.register('Clear Helpers', ClearHelperSymbols)
  
  
  })();