(function() {
  //Defiine the superclass
  var superClass = KT.Components.AN.Component;

  function addChildren(deep) {
    var source = this.get('source'),
        timeline = this.get('timeline'),
        deep = typeof deep === 'boolean' ? deep : true,
        i = 0,
        len,
        elements, element,
        children = [];

    KT.Frames({
      source: source,
      props: ['elements', 'duration', 'startFrame'],
      check: function(frame) { return frame.isKey === true},
      do: function(frame) {
        elements= frame.elements;
        len = elements.length;
        for (i = 0; i < len;i++){
          element = elements[i]
          children.push({
            source: element,
            frame: frame.startFrame,
            duration: frame.duration,
          })
        }
      }
    });
    
    for(i = 0, len = children.length; i < len; i++) {
      
      child = children[i];
      child.timeline = timeline;
      child.index = i;
      child = KT.Components.AN.create(child);
      if(!child) { return }
      child.set('parent', this);
      this.addChild(child);
      deep && child.addChildren();
    }
  }
  

  var LayerComponent = function(params) {
    params.type = params.type || 'Layer';
    superClass.call(this, params);
    this.set('isDataLayer', KT.Layers({
      layers: this.get('source'),
      timeline: this.get('timeline')
    }).getDataLayers().length > 0);
    this.set('isVisible', this.get('source').visible);
    
  };
  
  KT.Extend(LayerComponent, superClass);


  LayerComponent.prototype.addChildren =  function(deep) {
    addChildren.call(this, deep)
  },
  KT.Components.AN.Layer = LayerComponent;
})();