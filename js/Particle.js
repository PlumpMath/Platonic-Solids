/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Particle.js
 * extends Vector3 to generate random vertices
 */
 
Particle.prototype = new THREE.Vector3();

function Particle( distance ) {
    var half=distance/2;
    this.x = Math.random()*distance - half,
    this.y = Math.random()*distance - half,
    this.z = Math.random()*distance - half;
}
