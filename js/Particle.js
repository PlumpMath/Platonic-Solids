/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Particle.js
 * extends Vector3 to generate random vertices
 */
 
Particle.extends( THREE.Vector3 );

function Particle( distance ) {
    THREE.Vector3.call( this );
    var half=distance/2;
    this.x = Math.random()*distance - half,
    this.y = Math.random()*distance - half,
    this.z = Math.random()*distance - half;
}
