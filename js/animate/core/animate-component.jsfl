(function(){
var superClass = KT.Components.Component;

var ANComponent = function(params) {
  superClass.call(this, params);
  this.set('instance', params.instance || source)
  this.set('timeline', params.timeline)
  this.set('data', {
    position: [],
    anchor: [],
    rotation: [],
    size: [],
    scale: []
  });

};


ANComponent.prototype.getChildrenLength =  function() {return 0};

ANComponent.prototype.hasSymbols =  function() {
  var i = 0,
      len = this.components.length,
      hasSymbols = false;

  for(; i < len; i++) {
    hasSymbols = this.components[i].get('type') === 'Symbol';
    if(hasSymbols === true) break;
  }
  return hasSymbols
};

ANComponent.prototype.removeChildren = function() {
  this.components = []
},

ANComponent.prototype.printData = function(store){
  var store = store || this.get(),
      i = 0,
      len = this.components.length;
  store.components = [];

  for(; i < len; i++){
    store.components.push(this.components[i].printData());
  }
  return store
}

KT.Components.AN = {};
KT.Components.AN.Component = ANComponent;


})();