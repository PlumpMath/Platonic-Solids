/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * Star.js
 * extends RandomPoint to create a far off star
 */

Star.prototype = new RandomPoint();

function Star( distance ) {
    RandomPoint.apply( this, [distance] );
    this.setLength( this.length() +
        Math.random()*distance + distance/2 );
}