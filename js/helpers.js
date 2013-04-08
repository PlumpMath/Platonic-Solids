/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * helpers.js
 * adds to Vector3 to keep the points on the sphere
 */


THREE.Vector3.random=function(distance, index){
    var vec=new THREE.Vector3(
        Math.random()*distance- distance/2,
        Math.random()*distance - distance/2,
        Math.random()*distance - distance/2
    );
    if (index)
        vec.index=index;
    return vec;
}

THREE.Vector3.prototype.show=function(){
    this.setLength( RADIUS );
}

THREE.Vector3.prototype.be_gone=function(){
    this.setLength( RADIUS/12 );
}

Math.inverse=function( num ){
    if ( num==0 )
        return 0;
    return (1/num);
}