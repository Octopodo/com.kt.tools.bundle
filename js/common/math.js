
(function() {

function degreesToRadians(degrees) {
  return degrees * 3.14159265359/180;
}


function radiansToDegrees(radians) {
  return radians * 180/3.14159265359
}


/** Intersects two vectors and return common values of the vector
  * @function intersectVectors
  * @memberof KT
  * @param {2DVector} vectorOne
  * @param {2DVector} vectorTwo
  * @param {Number} max - Max intersection value
  * @param {Number} min - Min intersection value 
  * @returns The intersected vector
*/
function intersectVectors(vectorOne, vectorTwo, min, max) {
  var _max = (!max) ? Number.MAX_VALUE : max,
      min = (!min) ? -1 * Number.MIN_VALUE : min;

  _max = (_max < _min) ? _min : _max;
  _min = (_min > _max) ? _max : _min;
  var intersection = [vectorOne[0], vectorOne[1]];
  intersection[0] = (vectorOne[0] > vectorTwo[0]) ? vectorOne[0] : vectorTwo[0];
  intersection[1] = (vectorOne[1] < vectorTwo[1]) ? vectorOne[1] : vectorTwo[1];

  if (intersection[0] > intersection[1]) {
    intersection[0] = intersection[1]
  };
  if (intersection[1] < intersection[0]) {
    intersection[1] = intersection[0]
  };
  if (intersection[0] < _min) {
    intersection[0] = _min
  };
  if (intersection[1] < _min) {
    intersection[1] = _min
  };
  if (intersection[0] > _max) {
    intersection[1] = _max
  };
  if (intersection[1] > _max) {
    intersection[1] = _max
  };
  return intersection
}


/** Generates a random float in range(if passed)
  * @function randomFloat
  * @memberof KT
  * @param {Number} [min] - A min value
  * @param {Number} [max] - A max value
  * @returns A random float number 
*/
function randomFloat (min, max) {
  var max = max || Number.MAX_VALUE,
      min = min || Number.MIN_VALUE;
  return Math.random() * (max - min) + min;
}


/** Generates a rondom integer in range(if passed)
  * @function randomInt
  * @memberof KT
  * @param {Number} [min] - A min value
  * @param {Number} [max] - A max value
*/
function randomInt(min, max) {
  return _.randomInt(min, max)
}

function max(object) {

}
KT.Math = {
  degreesToRadians: degreesToRadians,
  radiansToDegrees: radiansToDegrees,
  randomFloat: randomFloat,
  randomInt: randomInt
}


})();