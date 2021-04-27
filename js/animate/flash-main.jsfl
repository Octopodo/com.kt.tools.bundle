
//Include modules
KT.Include.module('animate/flash-API');
KT.Include.module('animate/collector');
KT.Include.module('animate/collector/algorithms');
KT.Include.module('animate/commands')

/**Executes the collection of the assets based on the current settings
 * @function execute
 * @memberof KT.Colector
 */
KT.execute = function(){
  var startTime = _.now()
  KT.Test();
  var endTime = _.now();
  KT.Debug('Execution finished: '+ (endTime - startTime) / 1000 + 's')
  return
  
}

KT.Test = function () {
  // KT.Debug(KT.Library.itemExists('ferreras'));
  // KT.Commands.collectAndExportAE();
  KT.Commands.collectSelectedLayers()

  // KT.Commands.selectedLayersToSymbols(true)
  // KT.Document.getTimeline().setSelectedLayers(0)
  

  // var tl = KT.Document.getTimeline();
  // var layers = KT.Layers.getSelected(tl)

  // KT.Debug(layers)

  



};




