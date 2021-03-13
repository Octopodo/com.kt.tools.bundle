const csi = new CSInterface();
// const enviroment = csi.hostEnvironment
export default function evalScriptHandler(script){
  console.log(script)
  return new Promise(function(resolve, reject){
    return csi.evalScript(script, resolve);
  });
}

// module.exports =  evalScriptHandler;