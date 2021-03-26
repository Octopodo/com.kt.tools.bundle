const csi = new CSInterface();
// const enviroment = csi.hostEnvironment
function evalScriptHandler(script){
  console.log(script)
  return new Promise(function(resolve, reject){
    return csi.evalScript(script, resolve);
  });
}

evalScriptHandler.getAnimatePath = function() {
  var extPath = csi.getSystemPath(SystemPath.EXTENSION);

  // var jsflPath = extPath.replace('C:');
  extPath = extPath + '/js/'//encodeURI( "file:///" + jsflPath + '/js/' );
  return extPath
}

export default evalScriptHandler

// module.exports =  evalScriptHandler;