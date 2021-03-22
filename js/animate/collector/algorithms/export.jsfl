(function() {

var paths = {};
function ExportSymbol(path) {
  if(this.get('type') !== 'Group' && this.components.length > 0  || this.get('id').match(/export all/gi)) return
  var source = this.get('source'),
      id = this.get('id'),
      data = this.get('data'),
      path = path + '/' + id;
      
  data.path = FLfile.uriToPlatformPath(path).replace(/\\/g, '/') ; 
  
  if(source instanceof SymbolItem) {
    if(!paths[id]) {
      path = KT.IO.createFolder(path);
      source.exportToPNGSequence(path + '/' + id);
      paths[id] = true;
    }
  }
}


function ExportLayer(path) {
  var newSource = KT.Document.createSymbolFromLayers({
        layers: this.get('source'),
        timeline: this.get('timeline'),
        name: this.get('id'),
        path: 'KT_Backup'
      }),
      newLayer = newSource.timeline.layers[0],
      toSequence = KT.Frames({source: newLayer}).keys().length > 1;

  if(!toSequence) {

    newSource.timeline.removeFrames(1, newLayer.frames.length + 1)
  }
  newLayer.visible = true;
  this.set('source', newSource)
  
  ExportSymbol.call(this, path)
  // KT.Library.delete(newSource);
}


function ExportGroup(path) {
  
  if(this.isFolder) return;
  var toSequence,
      newLayer,
      toSequence,
      newSource = KT.Document.createSymbolFromLayers({
        layers: this.get('source'),
        timeline: this.get('timeline'),
        name: this.get('id'),
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

  this.set('source', newSource);
  newLayer = newSource.timeline.layers[0];
  toSequence = KT.Frames({source: newLayer}).keys().length > 1;

  if(!toSequence) {
    newSource.timeline.removeFrames(1, newLayer.frames.length + 1)
  }

  if(this.get('source').layerType !== 'folder' && this.get('isDataLayer') === false) {
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