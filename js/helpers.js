/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * helpers.js
 * adds to Vector3 to keep the points on the sphere
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