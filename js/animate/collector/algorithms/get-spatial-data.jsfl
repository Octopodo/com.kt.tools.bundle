(function(){

var SpatialData = function(){};

SpatialData.Layer = function(){
  var source = this.get('source'),
      data = this.get('data');

  if(this.get('isDataLayer')) return;
  KT.Frames({
    source: source,
    keys: true,
    do: function(frame) {
      var bounds = KT.Frames([frame]).bounds();
      data.position.push({x: bounds.x, y: bounds.y});
      data.anchor.push(KT.Element.getAnchorPoint(frame.elements));
      data.rotation.push(0);
      data.size.push({width: bounds.right - bounds.left, height: bounds.bottom - bounds.top});
      data.scale.push({x: 1, y:1})
    }
  })
  
}

SpatialData.Symbol = function(){
  var instance = this.get('instance'),
      data = this.get('data');
  data.position.push(KT.Element.getPosition(instance));
  data.anchor.push(KT.Element.getAnchorPoint(instance));
  data.rotation.push(KT.Element.getRotation(instance));
  data.size.push(KT.Element.getSize(instance));
  data.scale.push(KT.Element.getScale(instance));
}

SpatialData.Group = function(){

  var source = KT.Layers({
        layers: this.get('source'),
        timeline: this.get('timeline')
      }),
      data = this.get('data'),
      bounds,
      children;

  if(this.get('type') === 'Folder'){
    children = source.getChildren();
    children.unshift(source[0]);
    bounds = children.getBounds();
    data.position.push({x: bounds.x, y: bounds.y});
    data.anchor.push({x: bounds.width/2, y: bounds.height/2});
    data.rotation.push(0)
    data.size.push({
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
    });
    data.scale.push({x: 1, y:1})
  } else {
    SpatialData.Layer.call(this)
  }
    

}

SpatialData.Timeline = function(){
  var tempSymbol = KT.Library.create({
    name: this.get('id') + '_TEMP',
    path: 'KT_Backup',
    }),
    instance = KT.Library.addItemToTimeline({
      item: this.get('source'),
      timeline: tempSymbol.timeline,
    }).frames[0].elements[0],
    size = {
      width: KT.Document().width,
      height: KT.Document().height,
    },
    data = this.get('data');
    
  KT.Document.closeLibraryItem();

  data.position.push({x: size.width/2, y: size.height/2});
  data.anchor.push({x: size.width/2, y: size.height/2});
  data.rotation.push(0);
  data.size.push({width: size.width, height: size.height});
  data.scale.push({x: 1, y:1})
  this.setInstance(instance);

  // SpatialData.Symbol.call(this);
}

KT.Algorithm.register('Get Spatial Data', SpatialData)

})();