
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
  KT.Commands.collectAndExportAE();
  // KT.Debug('HELLLOOOOOO')

};




