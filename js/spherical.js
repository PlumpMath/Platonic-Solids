/*
 * Nick Sullivan
 * spherical.js
 * extends Vector3 to allow spherical coordinates
 */

/*
 * convenience method for creating a vec3 with latitude and longitude
 * parameters are passed in degrees (latitude between -90 and 90, longitude -180 to 180) 
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
function SphericalPoint( lat, lon ){
    var lat_rads = lat * Math.PI / 180;  // convert to radians
    var lon_rads = lon * Math.PI / 180;
    var x = -RADIUS * Math.cos(lat_rads) * Math.cos(lon_rads);
    var y = RADIUS * Math.sin(lat_rads);
    var z = RADIUS * Math.cos(lat_rads) * Math.sin(lon_rads);
    return {
        lat_rads:   lat_rads,
        lon_rads:   lon_rads,
        lat:        lat,
        lon:        lon,
        x:          x,
        y:          y,
        z:          z,
        update:     function( addToLat, addToLon ){
                        
        }
    }
}*/

