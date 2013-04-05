
/*
 * Nick Sullivan
 * http://github.com/ncksllvn
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
        /*this.velocity_z=this.acceleration(this.velocity_z)
        if (this.velocity_z>MAX_SPEED)
            this.velocity_z=MAX_SPEED;*/
    },
    backward: function(){
        
        /*this.velocity_z=this.deceleration(this.velocity_z)
        if (this.velocity_z<-(MAX_SPEED))
            this.velocity_z=-(MAX_SPEED);*/
    }
};

// function to control the slider (jQuery)
$( function(){
  $('#slide-control')
        .simpleSlider('setValue', MIN_VERTICES)
        .bind('slider:ready slider:changed', function (event, data) {
        
            while (data.value > SHOWN_VERTICES)
                SHOWN_VERTICES++
            
            while (data.value < SHOWN_VERTICES)
                platonic.geometry.vertices[--SHOWN_VERTICES].be_gone();
                
             $( '#particle-amount' ).html( SHOWN_VERTICES );
            
    }); 
    $( '#speed-control' )
        .simpleSlider( 'setValue', DEFAULT_SPEED )
        .bind('slider:ready slider:changed', function (event, data) {
            
            VERTEX_MOVEMENT_SPEED=data.value;
            $( '#speed' ).html( VERTEX_MOVEMENT_SPEED );
            
    }); 
});


// register the event listeners
document.addEventListener( 'keydown', on_key_down, false );
document.addEventListener( 'keyup', on_key_up, false );
document.addEventListener( 'onmousedrag', on_mouse_drag, false );
window.addEventListener( 'resize', on_window_resize, false ); 

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
            document.body.style.backgroundColor='#000000';
            break;
        case 50:    // 2 button
            document.body.style.backgroundColor='#ffffff';
            break;
        case 51:
            sphere.visible=!sphere.visible;
        default: 
            break;
    }
}

function on_key_up(event){
    switch( event.keyCode ){
        case 38:  // up
        case 40: // down
            camera_controls.velocity_z=0;
        default: 
            break;
    }
}
