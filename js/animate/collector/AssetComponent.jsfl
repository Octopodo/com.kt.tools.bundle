(function() {
  var superClass = KT.Components.AN.Symbol;

  var AssetComponent = function(params) {
    params.type = params.type || 'Asset';
    params.id = 'Element_' + params.index;
    superClass.call(this, params);
  };
  KT.Extend(AssetComponent, superClass);

  AssetComponent.prototype.addChildren = function() {};

  KT.Components.AN.Asset = AssetComponent;
})();