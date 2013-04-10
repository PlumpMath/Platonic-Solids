/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Particle.js
 * extends RandomPoint to keep the points on the sphere
 */

Particle.prototype = new RandomPoint();
 
function Particle( distance ) {
    RandomPoint.apply( this, [distance] );
    this.distance=distance;
    this.be_gone();
}

Particle.prototype.show=function(){
    this.setLength( RADIUS );
}

Particle.prototype.be_gone=function(){
    this.setLength( this.distance/30 );
}