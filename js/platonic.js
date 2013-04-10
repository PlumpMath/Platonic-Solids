
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

var geo_container, sphere, platonic, stars; // main geometric objects
    
var rotation_matrix=new THREE.Matrix4(),    // performs the rotation when on mouse drag
    SENSITIVITY=0.005;                      // change this to adjust drag/rotation sensitivity

var RADIUS=100;                             // the radius of the circle.

var MAX_PARTICLES=20,                       // the maximum amount of particles allowed on screen
    MIN_PARTICLES=0,                        // the minimum amount...
    shown_particles=3;                      // the number of particles currently showing
    
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
    camera = create_camera();
    platonic = create_platonic();  
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
    platonic.geometry.vertices
        .slice( 0, shown_particles )
        .forEach(update_position);
    
    // inform THREE.js that we've moved the particles
    platonic.geometry.verticesNeedUpdate=true;
    
    // rotate the sphere
    sphere.rotation.y-=0.003;
    stars.rotation.y-=0.002;
    
    renderer.render( scene, camera );
}

/*
 * the fun part
 * controls all of the particles that should be updated
 */
function update_position(particle, index){

    // loop through all the particles, applying their "push" to this particle
    platonic.geometry.vertices
        .slice( index, shown_particles )
        .forEach(
            function(other_particle){
            
                var force = Math.inverse(
                        particle.distanceToSquared( other_particle )
                        ) * intensity;
                
                var other_particle_force = other_particle.clone()
                    .multiplyScalar( force )
                    .negate();
                
                var this_particle_force = particle.clone()
                    .multiplyScalar( force )
                    .negate();
                
                other_particle.add( this_particle_force );
                particle.add( other_particle_force );
    });
    
    // move the particle back onto the sphere
    particle.show();
}

function create_platonic(particle_material_opts){
    var geo=new THREE.ParticleSystem( 
            new THREE.Geometry(),         // the container for our particles
            new THREE.ParticleBasicMaterial({
                wireframe:          true,
                size:               25,
                map:                THREE.ImageUtils.loadTexture(
                                        "images/particle.png"
                                    ),
                blending:           THREE.AdditiveBlending,
                transparent:        true,
                depthWrite:		    false
        })
    );
    
    /* add all of the vertices now, because it is too costly
    *  to add vertices dynamically, so is unsupported by three.js */
    for (var i=0; i<MAX_PARTICLES; i++)
        geo.geometry.vertices.push( new Particle( RADIUS*4 ) );
    return geo;
}

function create_camera() {
    return new THREE.PerspectiveCamera(         // most common type of camera
        60,                                     // field of view
        window.innerWidth / window.innerHeight, // aspect ratio: always use this, or else it'll look squished
        1,                                      // near clipping-plane: objects closer than this won't be rendered
        10000                                   // far clipping-plane: objects further away won't be rendered
    );
}
 
function create_sphere(){
    return new THREE.Mesh( new THREE.SphereGeometry(
            RADIUS*.90,    // radius - slightly smaller so particles "float"
            20,            // # of segments along width
            20             // # of segments along height
        ), new THREE.MeshBasicMaterial ({ 
            color:              0x057d9f,
            wireframe:          true
        }) 
    );  
}

function create_background(particle_material_opts){
    var background=new THREE.ParticleSystem( 
        new THREE.Geometry(),
        new THREE.ParticleBasicMaterial({
            size:               10,
            vertexColors:       THREE.vertexColors,
            color:              0x6D4CFF
        })
    );
    
    var distance=RADIUS*10;
    for (var i=0; i<1000; i++)
        background.geometry.vertices.push( new Star( distance ) );
    
    return background;
}

