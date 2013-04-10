/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * RandomPoint.js
 * extends Vector3 to generate random vertices
 */
 
RandomPoint.prototype = new THREE.Vector3();

function RandomPoint( distance ) {
    var half=distance/2;
    this.x = Math.random()*distance - half,
    this.y = Math.random()*distance - half,
    this.z = Math.random()*distance - half;
}
