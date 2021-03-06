(function(){
var debug = KT.System.Options.debug.components;

function createComponent(params) {
  var params = params || {},
      component;
  
  // params.source = source;
  params.id = params.source.name;
  // params.timeline = timeline;
  // KT.Debug(params.id)
  if(!(params.source instanceof Timeline) && !(params.timeline instanceof Timeline)) {
    throw new Error("Any Component needs a reference to his timeline")
  }

  switch(params.source.constructor.name) {
  case 'Timeline':
    component = new KT.Components.AN.Timeline(params)
    break;

  
  case 'SymbolItem:': 
  case 'SymbolInstance':
    params.id = KT.Path.split(params.source.libraryItem.name).name;
    component = new KT.Components.AN.Symbol(params)
    break;


  case 'Layer':
    var component;
    
    switch(params.source.layerType) {
    case 'folder':
      params.groupType = 'Folder'; 
      component = new KT.Components.AN.LayerGroup(params);
      break;
    case 'guide':
      params.groupType = 'Guide';
      component = new KT.Components.AN.LayerGroup(params);
      break;
    case 'mask':
      params.groupType = 'Mask';
      component = new KT.Components.AN.LayerGroup(params);
      break;

    default:
      component = new KT.Components.AN.Layer(params);
      break;
    }
    break;

  // default:
  //   component = new KT.Components.AN.Asset(params)
  //   break;
  }

  
  return component
}

KT.Components.AN.create = createComponent;

})();