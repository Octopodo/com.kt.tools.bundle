KT.Execute = function() {
  var startTime = _.now()
  KT.Test();
  var endTime = _.now();
  var time = (endTime - startTime) / 1000;
  time = time >= 60 ? time / 60 + 'm' : time + 's' 
  $.writeln('Execution finished: '+ time)
}

KT.Test = function() {

  // KT.Commands.BuildCharacter();
  KT.Commands.SwapSides();
  // var layer = KT.Layers('Hair')[0]
  // KT.Layers.rasterize(layer)



}

KT.Execute()