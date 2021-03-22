(function(){


function collectAndExport (exportAssets) {
  var document = KT.Document();
      docName = document.name.replace('.fla', ''),
      path = document.pathURI.replace(document.name, '') + 'KT_Exports';
  path =  KT.IO.createFolder(path);

  if(!path) {
    KT.Debug('Folder was not created');
    return
  }

  var timeline = KT.Document.getTimeline(),
      component = KT.Components.AN.create( { source: timeline});
      
  component.addChildren();
  component.algorithm('Get Timing Data');
  component.algorithm('Unmask');
  component.algorithm('Get Spatial Data');
  component.algorithm('Remask', true)
  component.algorithm('Simplify');
  component.algorithm('Parent Components', true)
  component.isRoot = true;

  // KT.Debug(component)
  // return
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

  // KT.Library.delete('KT_Backup')
  KT.Document.editTimeline(timeline)
  
}

KT.Commands.collectAndExportAE = collectAndExport;
})();