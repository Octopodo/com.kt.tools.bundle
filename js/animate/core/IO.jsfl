(function() {


function readFile(path) {
  var checkPath = FLfile.platformPathToURI(path),
      path = checkPath === '' ? path : checkPath,
      exists = FLfile.exists(path),
      content;
  
  if(!exists) {
    KT.Debug('File doesn\'t exists: ' + path )
    return ''
  }

  content = FLfile.read(path);

  if(!content) {
    KT.Debug('File doesn\'t exists: ' + path )
    return ''
  }

  return content
}


function readJSON(path) {
  var content;

  content = readFile(path);
  if(!content) {
    return 
  }
  
  content = JSON.parse(content);

  return content
}


function saveFile(path, data) {
  if(!_.isString(data)) return false;
  
  path = FLfile.write(path, data) ? path : false;
  return path 
}

function createFolder(path) {
  if(!_.isString(path)) return false;

  if(!FLfile.exists(path)) {
    path = FLfile.createFolder(path) ? path : false;
  }
  
  return path;

}





KT.System.IO = {
  readFile: readFile,
  readJSON: readJSON,
  createFolder: createFolder,
  saveFile: saveFile
}

KT.IO = KT.System.IO;


})();