KT.toCase = function(str){
    var split = str.split(' ');
    split = (split.length == 1)? split[0].split('_'): split;
    split[0] = split[0].toLowerCase();
    for(var i = 1, l = split.length; i < l; i++){
        split[i] = split[i].toLowerCase();
        split[i] = split[i][0].toUpperCase() + split[i].substr(1);
    }
    return split.join('')
}

KT.toSnakeCase = function(str){
    var split = str.split(' ');
    for(var i = 0, l = split.length; i < l; i++){
        split[i] = split[i].toLowerCase();
    }
    return split.join('_')
}

KT.toString = function(obj){
    return JSON.stringify(obj, null, 4)
}

KT.isFunction = function(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
 }

KT.duplicateDocument = function(document, inPlace, open) {


  KT.cleanBackupDocument(document)
  var name = document.name.replace('.fla', '') + '(KT_Collector_Backup).fla'
  KT.Debug('Duplicate in place:' + (inPlace));

  var path = inPlace ? document.path.replace('\\' + document.name, '') + '\\' : FLfile.uriToPlatformPath(an.browseForFolderURL('Select the export folder')) + '\\';
  KT.Debug("Path", path);

  var newPath = FLfile.platformPathToURI( path + name);
  var oldPath = FLfile.platformPathToURI(document.path);
  KT.Debug("Old Path: " + (oldPath), 'New Path: ' + newPath);

  var exists = FLfile.exists(newPath)
  var removed = exists ? FLfile.remove(newPath) : false;
  KT.Debug("File " + (newPath),'Exist:' +  (exists), 'Removed: ' + (removed));

  var created = FLfile.copy(oldPath, newPath);
  KT.Debug((document.name) + ' duplicated at ' + (newPath), 'Status: ' + (created) )

  var newDocument = an.openDocument(newPath)
  KT.Debug('Document opened', (an.getDocumentDOM().newDocument))

  return newDocument
}



KT.cleanBackupDocument = function(document) {
  KT.Debug("**********CLEAN BACKUP DOCUMENT*******")

  var match = document.name.match(/\(KT_Collector_Backup\).fla/g)
  KT.Debug('Match: ', match)

  if(match) {
    document.close();
    document = an.getDocumentDOM()
  }

  var name = document.name.replace('.fla', '') + '(KT_Collector_Backup).fla';

  var path =  document.path.replace('\\' + document.name, '') + '\\';
  var fullPath = path + name
  KT.Debug('Name: ' + (name), 'Path: ' + path, 'Full Path: ' + (fullPath))

  var exists = FLfile.exists(fullPath);
  var removed = exists ? FLfile.remove(fullPath) : false;
  KT.Debug('Exists: ' + (exists), 'Removed: ' + (removed))
}




KT.objectIsEmpty = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true
}

KT.String = {
  splitCamelCase: function(str) {
    if(typeof str !== 'string') return ''
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  },
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

KT.toFixed = function(value) {
  return value
  return parseFloat(value.toFixed(2))
}