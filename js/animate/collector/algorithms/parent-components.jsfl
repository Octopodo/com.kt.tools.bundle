(function() {

  function parentComponents() {
    var self = this;
    _.each(this.components, function(child) {
      child.set('parent', self)
    })
  }
  
  var ParentComponents = function(){}
  ParentComponents.default = parentComponents;
  
  KT.Algorithm.register('Parent Components', ParentComponents)
    
    
  })();