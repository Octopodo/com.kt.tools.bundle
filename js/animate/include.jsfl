

/**Toe main object
 * @namespace
 */


var KT = {}
KT.Components = {}
KT.Interfaces = {};
KT.System = {};
KT.Commands = {};
KT.firstInit = true

KT.System.setRootPath = function(path) {
  KT.System.rootPath =  FLfile.platformPathToURI(path)
  return path
}
KT.System.initialize = function() {
  var root = KT.System.rootPath; //'file:///c|/Program Files/Common Files/Adobe/CEP/Extensions/com.kt.tools.bundle/js/'
  KT.firsInit == false

  // KT.System.rootPath = function(){return root};

  KT.Include = function (paths) {
    
    var paths = paths instanceof Array ? paths : [paths]
    for(var i = 0; i < paths.length; i++) {
      var path = paths[i],
          file = {
            jsfl: root + path + '.jsfl',
            js: root + path + '.js',
            raw: root + path
          },
          loaded = false,
          exists,
          isFolder;
      for( var type in file) {
        exists = FLfile.exists(file[type]);
        isFolder = FLfile.listFolder(file[type]).length > 0;
        
        if(exists && !isFolder && !loaded){
          try{
            an.runScript(file[type]);
            break;
          } catch (e) {
            an.trace('Cant Include: ' + path);
            an.trace(e.message)
          }
        }
      }
    }
  }

  KT.Include.module = function(module) {
    var folder = root +  module + '/',
        files =  FLfile.listFolder(folder);
    
    files = _.filter(files, function(file) {
      return FLfile.listFolder(module + '/' +file).length === 0
    });
    files = _.map(files, function(file) {return module + '/' + file});
    KT.Include(files)
  }

  KT.Include([
    'common/underscore',
    'common/underscore_plus',
    'common/json2',
    'common/regexp',
    'animate/core/debuger',
    'animate/core/IO',
    'animate/core/underscore_plus'
  ]);

}


KT.System.reload = function(){
  KT.firstInit && KT.System.initialize();

  KT.Debuger.clearLog();
  KT.Include([
    'common/component',
    'common/algorithm',
    'animate/collector/UserTags',
    'animate/core/options',
    'common/patterns',
    'animate/core/animator-interface',
    'animate/core/utils',
    'animate/core/path',
    'animate/core/animate-component',
    'animate/collector/SymbolComponent'
  ]);
  KT.Include.module('animate/interfaces');
  KT.Include('animate/flash-main');

};



 

 