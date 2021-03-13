(function() {

var paths = {};
function ExportSymbol(path) {
  if(this.type !== 'Group' && this.components.length > 0  ) return
  var source = this.getSource(),
      path = path + '/' + this.getId();
      
  this.data.path = FLfile.uriToPlatformPath(path).replace(/\\/g, '/') ; 
  
  if(source instanceof SymbolItem) {
    if(!paths[this.getId()]) {
      path = KT.IO.createFolder(path);
      source.exportToPNGSequence(path + '/' + this.getId());
      paths[this.getId()] = true;
      
    }
  }
  
}


function ExportLayer(path) {
  var newSource = KT.Document.createSymbolFromLayers({
        layers: this.getSource(),
        timeline: this.getTimeline(),
        name: this.getId(),
        path: 'KT_Backup'
      }),
      newLayer = newSource.timeline.layers[0],
      toSequence = KT.Frames({source: newLayer}).keys().length > 1;
  if(!toSequence) {

    newSource.timeline.removeFrames(1, newLayer.frames.length + 1)
  }
  this.setSource(newSource)
  
  ExportSymbol.call(this, path)

  // this.setSource(this.setInstance())
  KT.Library.delete(newSource);
}


function ExportGroup(path) {
  
  if(this.isFolder) return;
  var toSequence,
      newLayer,
      toSequence,
      newSource = KT.Document.createSymbolFromLayers({
        layers: this.getSource(),
        timeline: this.getTimeline(),
        name: this.getId(),
        path: 'KT_Backup',
      });
  
  KT.Layers({
    source: newSource,
    timeline: newSource.timeline,
    do: function(layer) {
      layer.locked = false;
      layer.visible = true;
      layer.layerType = 'normal'
    }
  });

  newLayer = newSource.timeline.layers[0];
  toSequence = KT.Frames({source: newLayer}).keys().length > 1;

  if(!toSequence) {
    newSource.timeline.removeFrames(1, newLayer.frames.length + 1)
  }
  
  
  if(this.getId() === 'Character') {KT.Debug('Exporting fukn folder')}
  this.setSource(newSource);
  
  if(this.getSource().layerType !== 'folder' && this.isDataLayer === false) {
  
    ExportSymbol.call(this, path);
  }
}


var ExportAsset = function(){}
ExportAsset.Layer = ExportLayer;
ExportAsset.Symbol = ExportSymbol;
ExportAsset.Timeline = ExportSymbol;
ExportAsset.Group = ExportGroup;
KT.Algorithm.register('Export', ExportAsset)


})();