/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * spherical.js
 * extends Vector3 to keep the points on the sphere
 */


THREE.Vector3.random=function(index){
    var vec=new THREE.Vector3(
        Math.random()*RADIUS*4 - RADIUS*2,
        Math.random()*RADIUS*4 - RADIUS*2,
        Math.random()*RADIUS*4 - RADIUS*2
    );
    vec.index=index;
    return vec;
}

THREE.Vector3.prototype.show=function(){
    platonic.geometry.colors[ this.index ] = new THREE.Color(0xffb300);
    platonic.geometry.colorsNeedUpdate=true;
    this.setLength( RADIUS );
    console.log( this );
}

THREE.Vector3.prototype.be_gone=function(){
    platonic.geometry.colors[ this.index ] = new THREE.Color(0x071c71);
    platonic.geometry.colorsNeedUpdate=true;
    this.setLength( RADIUS/12 );
}

Math.inverse=function( num ){
    if ( num==0 )
        return 0;
    return (1/num);
}