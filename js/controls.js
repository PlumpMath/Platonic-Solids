
/*
 * Nick Sullivan
 * controls.js
 * this file contains the camera controller and event handlers
 */

var camera_controls={                       // controls camera movement.
    velocity_z: 0,                          // this is designed to be easily changed for more a more interesting
    rotate_degrees: 0,                      // velocity function in the future
    acceleration: function( x ){
        return 5; //(x+1)*2;
    },
    deceleration: function( x ){
        return -5; //-((Math.abs(x)+1)*2);
    },
    forward: function(){
        this.velocity_z=this.acceleration(this.velocity_z)
        if (this.velocity_z>MAX_SPEED)
            this.velocity_z=MAX_SPEED;
    },
    backward: function(){
        this.velocity_z=this.deceleration(this.velocity_z)
        if (this.velocity_z<-(MAX_SPEED))
            this.velocity_z=-(MAX_SPEED);
    }
};

/* 
   on_mouse_drag handles the onmousedrag event
   note: onmousedrag is a CUSTOM event (see mouse.js)
   desc: rotates the scene when the user drag with their mouse
*/
function on_mouse_drag(){
    var z_vec=new THREE.Vector3( 0, 0, 1);
    var drag_vec=new THREE.Vector3( mouse.dx, mouse.dy, 0);
    var axis=new THREE.Vector3().crossVectors(z_vec, drag_vec);
    var degrees=SENSITIVITY*drag_vec.length();
    rotation_matrix.identity();
    if (drag_vec.length()>0){   // if length() returns 0, this will cause NaN's
        rotation_matrix.rotateByAxis( axis, degrees );
    }
}

// maintain the aspect ratio on the resize event
function on_window_resize() {  
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// handles all key events and dishes out the work
function on_key_down(event){
    //console.log( event.keyCode );
    switch( event.keyCode ){
        case 38:    // up
            camera_controls.forward();
            break;
        case 40:    // down
            camera_controls.backward();
            break;
        case 49:    // 1 button
            sphere.material.wireframe=true;
            document.body.className='style_dark';
            break;
        case 50:    // 2 button
            sphere.material.wireframe=false;
            document.body.className='style_light';
            break;
        case 39:   // right
            add_vertex();
            break;
        case 37:   // left
            remove_vertex();
            break;
        default: 
            break;
    }
}

function on_key_up(event){
    switch( event.keyCode ){
        case 38:  // up
            camera_controls.velocity_z=0;
            break;
        case 40: // down
            camera_controls.velocity_z=0;
            break;
        default: 
            break;
    }
}