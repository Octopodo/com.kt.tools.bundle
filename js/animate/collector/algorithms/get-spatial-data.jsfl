(function(){

var SpatialData = function(){};

SpatialData.Layer = function(){
  var source = this.getSource(),
      bounds,
      self = this;
  if(this.isDataLayer) return;
  KT.Frames({
    source: source,
    keys: true,
    do: function(frame) {
      // KT.Debug(source.name, self.getTimeline().name)
      var bounds = KT.Frames([frame]).bounds();
      
      self.data.position.push({x: bounds.x, y: bounds.y});
      self.data.anchor.push(KT.Element.getAnchorPoint(frame.elements));
      self.data.rotation.push(0);
      self.data.size.push({width: bounds.right - bounds.left, height: bounds.bottom - bounds.top});
      self.data.scale.push({x: 1, y:1})
    }
  })
  
}

SpatialData.Symbol = function(){
  // if(this.getId() === 'teeth_upr'){
  //   KT.Debug(this)
  // }
  var instance = this.getInstance();
  this.data.position.push(KT.Element.getPosition(instance));
  this.data.anchor.push(KT.Element.getAnchorPoint(instance));
  this.data.rotation.push(KT.Element.getRotation(instance));
  this.data.size.push(KT.Element.getSize(instance));
  this.data.scale.push(KT.Element.getScale(instance))
  // this.data.position.x = -this.data.position.x;
  // this.data.position.y = -this.data.position.x; 
}

SpatialData.Group = function(){

  var source = KT.Layers({
        layers: this.getSource(),
        timeline: this.getTimeline()
      }),
      bounds,
      children;

  if(this.type === 'Folder'){
    children = source.getChildren();
    children.unshift(source[0]);
    bounds = children.getBounds();
    this.data.position.push({x: bounds.x, y: bounds.y});
    this.data.anchor.push({x: bounds.width/2, y: bounds.height/2});
    this.data.rotation.push(0)
    this.data.size.push({
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
    });
    this.data.scale.push({x: 1, y:1})
  } else {
    SpatialData.Layer.call(this)
  }
    

}

SpatialData.Timeline = function(){
  var tempSymbol = KT.Library.create({
    name: this.getId() + '_TEMP',
    path: 'KT_Backup',
    }),
    instance = KT.Library.addItemToTimeline({
      item: this.getSource(),
      timeline: tempSymbol.timeline,
    }).frames[0].elements[0],
    size = {
      width: KT.Document().width,
      height: KT.Document().height,
    }
    
  KT.Document.closeLibraryItem();

  this.data.position.push({x: size.width/2, y: size.height/2});
  this.data.anchor.push({x: size.width/2, y: size.height/2});
  this.data.rotation.push(0);
  this.data.size.push({width: size.width, height: size.height});
  this.data.scale.push({x: 1, y:1})
  this.setInstance(instance);

  // SpatialData.Symbol.call(this);
}

KT.Algorithm.register('Get Spatial Data', SpatialData)

})();