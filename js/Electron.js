/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Electron.js
 * extends Particle to keep the points on the sphere
 */

Electron.extends( Particle );
 
function Electron( distance ) {
    Particle.call( this, distance );
    this.antigravity=new THREE.Vector3;
    this.old=new THREE.Vector3;
    this.velocity=new THREE.Vector3( this.x, this.y, this.z );
    this.sleep();
}

Electron.prototype.accumulate=function( other_electron ) {

    var force = Math.inverse( this.distanceToSquared( other_electron ) )* intensity;

    var other_electron_force = other_electron.clone()
        .multiplyScalar( force )
        .negate();
        
    this.antigravity.add( other_electron_force );
    
}
Electron.prototype.show=function(){
    this.velocity=new THREE.Vector3( this.x, this.y, this.z );
}

Electron.prototype.sleep=function(){
    this.setLength( RADIUS/15 );
}

Electron.prototype.toString=function(){
    return "Electron: ";
}



