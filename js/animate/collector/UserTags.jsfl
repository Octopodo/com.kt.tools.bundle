(function(){

var rootPath = KT.System.rootPath;
var tagsPath = 'animate/UserTags.json';
var tags = KT.System.IO.readJSON(rootPath + tagsPath);


function checkTag( path , tag) {
  var tagTester = getTag(path);

  if(!tagTester) return false;

  tagTester = KT.RegExp(tagTester);
  pass = tag.match(tagTester);
  pass = pass !== null ? true : false;

  return pass
}


function getTag(path) {
  var path = path.split('.'),
      len = path.length,
      tag = tags,
      i = 0;


  for(; i < len; i++) {
    tag = tag[path[i]];
    if(!tag) {
      break;
    }
  }
  
  return tag
}

KT.Tags = {
  check: checkTag,
  getTag: getTag
}
 


})();