
/*
 * Nick Sullivan
 * controls.js
 * this file contains the camera controller and event handlers
 */

 /*
  * controls camera movement
  * not as cool as I intended it to be, but to be done eventually
  */

var camera_controls={  
    velocity_z: 0,                       
    rotate_degrees: 0,                    
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

function add_vertex(){
    if (SHOWN_VERTICES<MAX_VERTICES){
        //platonic.geometry.vertices[SHOWN_VERTICES].spherical(Math.random()*360-180, Math.random()*360-180);
        SHOWN_VERTICES++;
    }
}

function remove_vertex(){   
    console.log( 'here' );
    SHOWN_VERTICES--;
    platonic.geometry.vertices[SHOWN_VERTICES].x=-1000,
    platonic.geometry.vertices[SHOWN_VERTICES].y=-1000,
    platonic.geometry.vertices[SHOWN_VERTICES].z=-1000;
    
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
            sphere.visible=true;
            break;
        case 50:    // 2 button
            sphere.visible=false;
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

// register the event listeners
document.addEventListener( 'keydown', on_key_down, false );
document.addEventListener( 'keyup', on_key_up, false );
document.addEventListener( 'onmousedrag', on_mouse_drag, false );
window.addEventListener( 'resize', on_window_resize, false ); 

// function to control the slider (jQuery)
$( function(){
  $("#slide-control")
    .simpleSlider("setValue", MIN_VERTICES)
    .bind("slider:ready slider:changed", function (event, data) {
        if (data.value > SHOWN_VERTICES){
             while( SHOWN_VERTICES < data.value )
                platonic.geometry.vertices[SHOWN_VERTICES++].beGone();
        }
        else if (data.value < SHOWN_VERTICES)
             while( SHOWN_VERTICES > data.value )
                platonic.geometry.vertices[--SHOWN_VERTICES].beGone();
    }); 
});
    