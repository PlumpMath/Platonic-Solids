
/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * ForceVector.js
 * 
 * A vector class that merely accumulates the force between one vector and another
 */

ForceVector.extends( THREE.Vector3 );

function ForceVector(){
    THREE.Vector3.call( this );
}

ForceVector.prototype.accumulate_force_between =
    function( electron, other_electron ){
        
        // scale the strength based on distance to the other electron
        var strength = Math.inverse( electron.distanceToSquared( other_electron ) ) * intensity;
        
        // now calculate the force vector
        var other_electron_force = other_electron.clone()
            .multiplyScalar( strength )
            .negate();
            
        this.add( other_electron_force );
        
}