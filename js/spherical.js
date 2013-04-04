/*
 * Nick Sullivan
 * spherical.js
 * extends Vector3 to allow spherical coordinates
 */

/*
 * convenience method for creating a vec3 with latitude and longitude
 * parameters are passed in degrees
 */
function Spherical( lat, lon ){
    var vec=new THREE.Vector3();
    vec.spherical( lat, lon );
    return vec;
}

THREE.Vector3.prototype.spherical=function(lat,lon){
    var lat_rads = lat * Math.PI / 180;  // convert to radians
    var lon_rads = lon * Math.PI / 180;
    this.lat=lat%360;
    this.long=lon%360;
    this.x = -RADIUS * Math.cos(lat_rads) * Math.cos(lon_rads);
    this.y =  RADIUS * Math.sin(lat_rads);
    this.z =  RADIUS * Math.cos(lat_rads) * Math.sin(lon_rads);
}

THREE.Vector3.prototype.add_spherical=function( add_lat, add_lon ){
    this.spherical( this.lat+add_lat, this.long+add_lon );
}

/*
 * this is used to cycle through every vertex, normalizing the
 * length of the vector to RADIUS to keep it on the sphere
 */
Array.prototype.keepOnSphere=function(){
    this.forEach( function(vertex, index){
        var vector=new THREE.Vector3( vertex.x, vertex.y, vertex.z );
        vector.setLength( RADIUS );
        vertex.x=vector.x,
        vertex.y=vector.y,
        vertex.z=vector.z;
    });
}

// this is really only for readability
Math.inverse=function( num ){
    if ( num==0 )
        return 0;
    return (1/num);
}













