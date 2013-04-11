/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Star.js
 * extends Particle to create a far off star
 */

Star.prototype = new Particle();

function Star( distance ) {
    Particle.call( this, distance );
    this.setLength( this.length() +
        Math.random()*distance + distance/2 );
}