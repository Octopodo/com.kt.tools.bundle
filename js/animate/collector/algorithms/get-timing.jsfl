(function(){

function LayerTiming(source){

  var source = source || this.getSource(),
      frames = [],
      labels = [],
      actions = [];
  KT.Frames({
    source: source,
    keys: true,
    do: function(frame) {
      frames.push(frame.index);
      labels.push(frame.name);
      actions.push(frame.actionScript)
    }
  }),

  this.data.timing = {frames: frames, labels: labels, actions: actions};
  this.data.duration = source.frames.length;
}

function SymbolTiming() {
  var source = this.getInstance().layer;
  LayerTiming.call(this, source)
}

TimingData = function(){};
TimingData.Layer = LayerTiming;
TimingData.Group = LayerTiming;
TimingData.Symbol = SymbolTiming;

KT.Algorithm.register('Get Timing Data', TimingData)

})();