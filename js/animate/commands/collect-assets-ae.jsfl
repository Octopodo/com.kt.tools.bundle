(function(){


function collectAndExport (source, exportAssets) {
  var document = KT.Document();
      docName = document.name.replace('.fla', ''),
      path = document.pathURI.replace(document.name, '') + 'KT_Exports';
  path =  KT.IO.createFolder(path);

  if(!path) {
    KT.Debug('Folder was not created');
    return
  }

  var timeline = KT.Document.getTimeline(),
      source = !source ? timeline : source
      component = KT.Components.AN.create( { source: source, timeline: timeline});
      
  component.addChildren();
  component.algorithm('Get Timing Data');
  component.algorithm('Unmask');
  component.algorithm('Get Spatial Data');
  component.algorithm('Remask', true)<
  component.algorithm('Clear Circular Data');
  
  component.algorithm('Simplify');
  component.algorithm('Parent Components', true)
  component.set('isRoot', true);
  


  if(_.isBoolean(exportAssets) && exportAssets === false) return;
  path = KT.IO.createFolder(path + '/' + component.get('id'));
  if(!path) {
    KT.Debug('Component folder was not created');
    return
  }

  

  var dataPath = path + '/' + component.get('id') + '.kt.json';


  path = path + '/Assets';
  path =  KT.IO.createFolder(path);

  if(!path) {
    KT.Debug('Folder was not created');
    return
  }


  
  component.algorithm('Export', null, path);
  component.algorithm('Clear Circular Data');
  component.algorithm('Clear Helpers');
  
  dataPath = KT.IO.saveFile(dataPath, JSON.stringify(component.printData(), null, 2));

  if(!dataPath) {
    KT.Debug('Data file was not saved');
    return
  }

  KT.Library.delete('KT_Backup')
  KT.Document.editTimeline(timeline)
}


function collectSelectedLayers() {
  var timeline = KT.Document.getTimeline(),
      layers = KT.Layers.getSelected(timeline),
      newSymbol;

  if(layers.length <= 0) return;

  // KT.Debug(layers)

  newSymbol = KT.Document.createSymbolFromLayers({
    timeline: timeline,
    layers: layers, 
    replace: false,
    name: layers[0].name,
    path: 'KT_Backup'
  });
  collectAndExport(newSymbol.timeline)
};

KT.Commands.collectSelectedLayers = collectSelectedLayers;
KT.Commands.collectAndExportAE = collectAndExport;
})();