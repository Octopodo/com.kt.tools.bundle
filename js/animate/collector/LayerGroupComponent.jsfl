(function() {
  //Defiine the superclass
  var superClass = KT.Components.Component;
  

  function addChildren() {
    
    var source = this.getSource(),
        timeline = this.getTimeline(),
        layers = KT.Layers.getChildren(source, timeline),
        i = 0,
        len = layers.length,
        child;
    // if(this.)
    for(; i < len; i++) {
      
      child = KT.Components.create({
        source: layers[i],
        timeline: timeline
      });
      child.parent = this;
      this.addChild(child);
      child.addChildren();
      i += child.getChildrenLength()
    }

    // KT.Debug(this.getId().toUpperCase() + ': ' + this.components.length)
  }


  var LayerGroupComponent = function(params) {
    var params = params,
        layer = params.source,
        timeline = params.timeline,
        children = KT.Layers({layers: layer, timeline: timeline}).getChildren(),
        index = children.length; //> 0 ? children.last().index : 0;
    
    

    params.type = params.type || 'Group';
    superClass.call(this, params);


    this.isDataLayer = KT.Layers({
      layers: this.getSource(),
      timeline: this.getTimeline
    }).getDataLayers().length > 0;

    this.isMask = layer.layerType === 'mask';
    this.isGuide = layer.layerType === 'guide';
    this.isFolder= layer.layerType === 'folder';
    
    this.getChildrenLength = function() {
      return index
    }

    
  };
  KT.Extend(LayerGroupComponent, superClass)

  LayerGroupComponent.prototype.addChildren = function() {
    return addChildren.call(this)
  
  };

  KT.Components.LayerGroup = LayerGroupComponent;
})();