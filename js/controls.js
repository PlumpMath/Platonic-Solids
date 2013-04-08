
/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * controls.js
 * this file contains the camera controller and event handlers
 */

// function to control the sliders (jQuery)
$( function(){

    var particle_span=$( '#particle-amount' )
        .html( shown_particles );
        
    var intensity_span= $( '#intensity' )
        .html( intensity );
    
    var PARTICLE_RANGE=MAX_PARTICLES-MIN_PARTICLES;
    
    var INTENSITY_RANGE=MAX_INTENSITY-MIN_INTENSITY;
    
    $('#particle-control')
        .simpleSlider()
        .simpleSlider('setValue', (shown_particles-MIN_PARTICLES)/MAX_PARTICLES )
        .bind('slider:ready slider:changed',         
            function (event, data) {
            
                var val=MIN_PARTICLES + data.value*PARTICLE_RANGE;
            
                while (val > shown_particles)
                    shown_particles++
                
                while (val < shown_particles)
                    platonic.geometry.vertices[--shown_particles].be_gone();
                    
                 particle_span.html( shown_particles );
                 
    }); 
    
    $( '#intensity-control' )
        .simpleSlider()
        .simpleSlider( 'setValue', (intensity-MIN_INTENSITY)/MAX_INTENSITY )
        .bind('slider:ready slider:changed', 
            function (event, data) {
                
                intensity=parseInt( MIN_INTENSITY + data.value*INTENSITY_RANGE );
                intensity_span.html( intensity );
            
    });
    
    $( '#background-button' ).on( 'click', 
        function(){
            on_key_down( { keyCode : 49 } );
    });
    
    $( '#sphere-button' ).on( 'click', 
        function(){
            on_key_down( { keyCode : 50 } );
    });
    
    // register the event listeners
    document.addEventListener( 'keydown', on_key_down, false );
    document.addEventListener( 'onmousedrag', on_mouse_drag, false );
    window.addEventListener( 'resize', on_window_resize, false ); 
    onload();
});


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
	WINDOW_HALF_X = window.innerWidth / 2;
	WINDOW_HALF_Y = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// handles all key events and dishes out the work
function on_key_down(event){
    switch( event.keyCode ){
        case 49:    // 1 button
            document.body.style.backgroundColor=
                ( document.body.style.backgroundColor=='white' ) ? 'black' : 'white';
            break;
        case 50:
            sphere.visible=!sphere.visible;
        default: 
            break;
    }
}

