/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Electron.js
 * extends Particle to keep the points on the sphere
 */

Electron.extends( Particle );
 
function Electron( distance ) {
    Particle.call( this, distance );
    this.sleep();
}

Electron.prototype.interact_with=function( other_electron ) {

    var force = Math.inverse(
            this.distanceToSquared( other_electron )
            ) * intensity;

    var other_electron_force = other_electron.clone()
        .multiplyScalar( force )
        .negate();

    var this_electron_force = this.clone()
        .multiplyScalar( force )
        .negate();

    other_electron.add( this_electron_force );
    this.add( other_electron_force );
    
    // move this electron back onto the sphere
    this.stays_on_sphere();
}

Electron.prototype.stays_on_sphere=function(){
    this.setLength( RADIUS );
}

Electron.prototype.sleep=function(){
    this.setLength( RADIUS/15 );
}

Electron.prototype.toString=function(){
    return "Electron: ";
}





