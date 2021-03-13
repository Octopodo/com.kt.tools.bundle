/**Toe main object
 * @namespace
 */


var KT = {}
KT.Components = {}
KT.Interfaces = {};
KT.System = {};
KT.Commands = {};
KT.firstInit = true

KT.System.initialize = function() {
  var root = 'file:///c|/Program Files/Common Files/Adobe/CEP/Extensions/com.kt.tools.bundle/js/'
  KT.firsInit == false

  KT.System.rootPath = function(){return root};

  KT.Include = function (paths) {
    
    var paths = paths instanceof Array ? paths : [paths]
    for(var i = 0; i < paths.length; i++) {
      var path = paths[i];
      try{
        var result = an.runScript(root + path + '.jsfl');
        // an.trace('Loaded: ' + path) 
      } catch (e) {
        an.trace('Cant Include: ' + path);
        an.trace(e.message)
      }
    }
  }

  KT.Include.module = function(module) {
    var folder = root +  module + '/',
        files =  FLfile.listFolder(folder),
        len = files.length,
        file,
        loaded,
        index,
        i;
    if(len > 0) {
      for(i = 0; i < len; i++) {
        file = folder + files[i];
        try {
          loaded = an.runScript(file);
          // an.trace('Loaded: ' + files[i]) 
        } catch (e) {
          an.trace('Can\'t read Script: ' + file + '\n' + e.message)
        }
      }
    }
  }

  KT.Include([
    'common/underscore',
    'common/json2',
    'common/regexp',
    'animate/core/debugger',
    'animate/core/IO',
  ]);

}
KT.firstInit && KT.System.initialize();

KT.System.reload = function(){
  KT.Debug('Reloading');
  KT.Debugger.clearLog();
  KT.Include([
    'common/algorithm',
    'animate/collector/UserTags',
    'animate/core/options',
    'common/patterns',
    'animate/core/utils',
    'animate/core/animator-interface',
    'animate/core/utils',
    'animate/core/path',
    'animate/core/component',
    'animate/collector/SymbolComponent'
  ]);
  KT.Include.module('animate/interfaces');
  KT.Include('animate/flash-main');
};



