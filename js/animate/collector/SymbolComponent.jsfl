(function() {
  var superClass = KT.Components.Component;
  ////////////////////////////////////////
  function addChildren() {
    var source = this.getSource(),
        layers = source.timeline.layers,
        i = 0,
        len = layers.length,
        child;
    for(; i < len; i++) {
      child = KT.Components.create({
        source: layers[i],
        timeline: source.timeline
      });
      child.parent = this;
      this.addChild(child);
      child.addChildren();
      i += child.getChildrenLength()
    }
  }




  ////////////////////////////////////////
  var SymbolComponent = function SymbolComponent(params) {
    var source = params.source instanceof SymbolInstance ? params.source.libraryItem
          :  params.source,
        instance = params.source instanceof SymbolInstance ? params.source 
          : params.instance instanceof SymbolInstance? params.instance
          : source,

        
        frame = params.frame;
        this.getFrame = function() {return frame};

        
    params.type = params.type || 'Symbol';
    params.source = source;
    params.instance = instance;
    superClass.call(this, params)

  };
  KT.Extend(SymbolComponent, superClass);

  SymbolComponent.prototype.addChildren = function() {
    addChildren.call(this);
  };
    
  KT.Components.Symbol = SymbolComponent;
})();