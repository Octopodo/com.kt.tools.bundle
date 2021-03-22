(function() {
  var superClass = KT.Components.AN.Symbol;
  function addChildren() {
    var timeline = this.get('timeline'),
        layers = timeline.layers,
        i = 0,
        len = layers.length,
        child;
    for(; i < len; i++) {
      child = KT.Components.create({
        source: layers[i],
        timeline: timeline
      });
      child.set('parent', this);
      this.addChild(child);
      child.addChildren();
      i += child.getChildrenLength();
    }
  }


  ////////////////////////////////
  function TimelineComponent(params) {
    
    var params = params || {};
    params.type = 'Timeline';
    params.timeline = params.source,
    params.source = KT.Document.createSymbolFromLayers({
          path:'KT_Backup', 
          type: 'graphic',
          timeline: params.source,
          replace: false,
          name: params.id,
        });
        
    superClass.call(this, params);
    
  };
  KT.Extend(TimelineComponent, superClass);

  TimelineComponent.prototype.addChildren = function() {
    addChildren.call(this);
  };

  KT.Components.AN.Timeline = TimelineComponent;
})();