/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Electron.js
 * extends Particle to keep the points on the sphere
 */

Electron.extends( Particle );
 
function Electron( distance ) {
    Particle.call( this, distance );
    this.velocity=new THREE.Vector3;
    this.sleep();
}

Electron.prototype.sleep=function(){
    this.setLength( RADIUS/15 );
}