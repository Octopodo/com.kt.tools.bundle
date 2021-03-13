(function(){

  function split(fullName) {
    var path ,name, extension;
    
    var split = fullName.split(/\/+|\\+/gi)
    var nameSplit = split.length > 0 ? split.pop().split('.') : [];
    name = nameSplit[0].length > 0 ? nameSplit[0] : ''
    extension = nameSplit[1] ? nameSplit[1] + '.' : ''
    path = split.length > 0 ? split.join('/') + '/' : '';
  
    return {
      path: path,
      name: name,
      extension: extension,
      fullName: name + extension,
      source: fullName
    }
  }
  
  function join(pathObj) {
    for(var i in pathObj) {
      pathObj[i] = pathObj[i] || ''
    }
  
    return pathObj.path + pathObj.name + pathObj.extension
  
  }
  
  
  KT.Path = {
    split: split,
    join: join
  }
  
  })()