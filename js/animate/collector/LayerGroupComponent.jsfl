(function() {
  //Defiine the superclass
var superClass = KT.Components.AN.Component;


function addChildren() {
  
  var source = this.get('source'),
      timeline = this.get('timeline'),
      layers = KT.Layers.getChildren(source, timeline),
      i = 0,
      len = layers.length,
      child;

  for(; i < len; i++) {
    
    child = KT.Components.AN.create({
      source: layers[i],
      timeline: timeline
    });
    child.set('parent', this);
    this.addChild(child);
    child.addChildren();
    i += child.getChildrenLength()
  }


}


function getChildrenLength () {
  var len = this.components.length,
      i = 0,
      child,
      length = KT.Layers.getChildren( this.get('source'), this.get('timeline')).length
  
  for(; i < len; i++) {
    child = this.components[i];
    length += child.getChildrenLength()
  }

  return length
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
    layers: this.get('source'),
    timeline: this.get('timeline')
  }).getDataLayers().length > 0;

  this.set('isMask', layer.layerType === 'mask');
  this.set('isGuide', layer.layerType === 'guide');
  this.set('isFolder', layer.layerType === 'folder');
  
  

  
};
KT.Extend(LayerGroupComponent, superClass)

LayerGroupComponent.prototype.addChildren = function() {
  return addChildren.call(this)
};

LayerGroupComponent.prototype.getChildrenLength = function() {
  
  return getChildrenLength.call(this)
};

KT.Components.AN.LayerGroup = LayerGroupComponent;

})();