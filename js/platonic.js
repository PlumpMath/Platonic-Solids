
/*
* Nick Sullivan
* http://github.com/ncksllvn
* file: platonic.js
*
* This file contains only the primary/fun functions that manipulate the vertices.
* The controls file has (mostly) everything that deals with user interaction, including
* how the sphere is rotated, and the onscreen slider.
*
* This project uses the amazing three.js (https://github.com/mrdoob/three.js/)
*/

var camera, scene, renderer;                // see three.js documentation

var geo_container, sphere,                  // main objects
    electron_system, electrons, stars;
    
var rotation_matrix=new THREE.Matrix4(),    // performs the rotation when on mouse drag
    SENSITIVITY=0.005;                      // change this to adjust drag/rotation sensitivity

var RADIUS=100;                             // the radius of the circle.

var MAX_ELECTRONS=20,                       // the maximum amount of electrons allowed on screen
    MIN_ELECTRONS=0,                        // the minimum amount...
    shown_electrons=3;                      // the number of electrons currently showing
    
var MIN_INTENSITY=0,                        // lowest force of particles
    MAX_INTENSITY=600,                      // strongest force of particles
    intensity=30;                           // current speed of particles

// called after the controls are set up
function onload(){
    try {
        init();
    } 
    catch( error ) {
        alert( 'Your browser does not support WebGL.' );
        console.error( error );
        return;
    }
    on_enter_frame();
}

/*
 * large function that does all of the necessary setting up for THREE.js
 */
function init(){
    scene=new THREE.Scene();                                     // holds all geometry
    renderer = new THREE.WebGLRenderer();                        // renders the scene
    renderer.setSize( window.innerWidth, window.innerHeight);    // sets the screen size
    document.body.appendChild( renderer.domElement );            // appends the renderer - a <canvas> - to the scene
    
    // create main objects
    var platonic = create_platonic();  
    camera = create_camera();
    stars = create_background();       
    sphere = create_sphere();
    
    // create a container for mouse drag rotations
    geo_container = new THREE.Object3D();  
    geo_container.add( sphere );
    geo_container.add( platonic );
    geo_container.add( stars );
    
    // add that container to the scene
    scene.add( geo_container );
    
    // set up camera 
    camera.position.z = -RADIUS*2.5;
    camera.lookAt( scene.position );

 }
/* 
 * called every frame of animation
 * tradition as3 name for the function called every frame (~60 fps)
 */
function on_enter_frame(){

    // request this function again for the next frame
    requestAnimationFrame( on_enter_frame );
    
    // rotate the sphere (see controls.js)
    if (mouse.is_dragging){
        geo_container.applyMatrix( rotation_matrix );
        rotation_matrix.identity();
    }
    
    // animate those particles that need animating
    electrons
        .slice( 0, shown_electrons )
        .forEach(update_position);
    
    // inform three.js that we've moved the particles
    electron_system.verticesNeedUpdate=true;
    
    // rotate the sphere
    sphere.rotation.y-=0.003;
    stars.rotation.y-=0.002;
    
    renderer.render( scene, camera );
}

/*
 * delegates the interaction of electrons to the electron class
 */
function update_position(electron, index){
    
    // loop through all the electrons, applying their "push" to this electron
    electrons
        .slice( index, shown_electrons )
        .forEach( function( other_elec ) {
            electron.interact_with( other_elec );
        });

}

function create_platonic(){

    electron_system = new THREE.Geometry();
    electrons = electron_system.vertices;
    
    var system=new THREE.ParticleSystem( 
            electron_system,
            new THREE.ParticleBasicMaterial({
                wireframe:          true,
                size:               25,
                map:                THREE.ImageUtils.loadTexture(
                                        "images/particle.png" ),
                blending:           THREE.AdditiveBlending,
                transparent:        true,
                depthWrite:		    false
        })
    );
    
    /* add all of the vertices now, because it is too costly
    *  to add vertices dynamically, so is unsupported by three.js */
    
    for (var i=0; i<MAX_ELECTRONS; i++)
        electrons.push( new Electron( RADIUS*4 ) );
        
    return system;
}

function create_camera() {
    return new THREE.PerspectiveCamera(         // most common type of camera
        60,                                     // field of view
        window.innerWidth / window.innerHeight, // aspect ratio: always use this, or else it'll look squished
        1,                                      // near clipping-plane: objects closer than this won't be rendered
        1500                                    // far clipping-plane: objects further away won't be rendered
    );
}
 
function create_sphere(){
    return new THREE.Mesh( new THREE.SphereGeometry(
            RADIUS*.90,    // radius - slightly smaller so particles "float" around it
            20,            // # of segments along width
            20             // # of segments along height
        ), new THREE.MeshBasicMaterial ({ 
            color:              0x057d9f,
            wireframe:          true
        }) 
    );  
}

function create_background(){
    var background=new THREE.ParticleSystem( 
        new THREE.Geometry(),
        new THREE.ParticleBasicMaterial({
            size:               10,
            color:              0x6D4CFF
        })
    );
    
    var distance=RADIUS*10;
    for (var i=0; i<1000; i++)
        background.geometry.vertices.push( new Star( distance ) );
    
    return background;
}

