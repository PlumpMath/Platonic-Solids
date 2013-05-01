
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

var camera, scene, renderer, clock;         // see three.js documentation

var geo_container, sphere, line,            // main objects
    electron_system, electrons, stars;
    
var rotation_matrix=new THREE.Matrix4();    // performs the rotation when on mouse drag
const SENSITIVITY=0.005;                    // change this to adjust drag/rotation sensitivity

const RADIUS=1;                             // the radius of the sphere.

const MAX_ELECTRONS=20,                     // the maximum amount of electrons allowed on screen
      MIN_ELECTRONS=0;                      // the minimum amount...
var shown_electrons=3;                      // the number of electrons currently showing
    
const MIN_INTENSITY=0,                      // lowest force of particles
      MAX_INTENSITY=2;                      // strongest force of particles
var intensity=1;                            // current speed of particles

const STAR_SPEED=0.005,
    SPHERE_SPEED=0.005;
    
var star_rotation=STAR_SPEED * intensity,   // speed of rotations based on the intensity
    sphere_rotation=SPHERE_SPEED * intensity;

var draw=false,
    dt=0,
    last_time=0;

// called after the controls are set up
function main(){
    try {
        init();
        on_enter_frame();
    } 
    catch( error ) {
        $( '#slider' ).hide();
        $( '#no-support' ).show();
        $( '#error' ).html( error );
    }
}

/* large function that does all of the necessary setting up */
function init(){
    scene=new THREE.Scene;                                     // holds all geometry
    renderer = new THREE.WebGLRenderer;                        // renders the scene
    renderer.setSize( window.innerWidth, window.innerHeight);    // sets the screen size
    renderer.setClearColorHex( 0x000000, 1 );                    // set background color of canvas
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
    
    clock=new THREE.Clock(true);
 }
 
/* called every frame of animation
 * tradition as3 name for the function called every frame (~60 fps) */
 
function on_enter_frame(){
    
    // how much time has passed since the last frame = dt
    dt = clock.getElapsedTime() - last_time;
    last_time=clock.getElapsedTime();
    
    // request this function again for the next frame
    requestAnimationFrame( on_enter_frame );
    
    // rotate the sphere according to a mouse drag
    if (mouse.is_dragging){
        geo_container.applyMatrix( rotation_matrix );
        rotation_matrix.identity();
    }
    
    // animate those particles that need animating
    electrons
        .slice( 0, shown_electrons )
        .forEach( update_position );
        
    // inform three.js that we've moved the particles
    electron_system.verticesNeedUpdate=true;
    
    // rotate the sphere
    sphere.rotation.y-=sphere_rotation;
    stars.rotation.y-=star_rotation;
    
    // render the scene
    renderer.render( scene, camera );
    
}

/* Loops through the electrons array, having this indexed
 * electron interact with those that have not already interacted
 * with it, and are currently active on the sphere. */ 
 
function update_position( electron ){
    
    // initialize the force that will be applied to this electron
    var f = new ForceVector;
    
    // loop through all of the electrons, gathering the force they are applying
    // to this current electron and store it in f
    electrons
        .slice( 0, shown_electrons )
        .forEach( function( other_electron ){
            f.accumulate_force_between( electron, other_electron );
    });
    
    var fnew = new THREE.Vector3;
    // set fnew to the force vector tangent to the sphere
    fnew.subVectors( f, electron.clone().multiplyScalar( electron.dot( f ) ) );
    fnew.multiplyScalar( intensity );
    
    // calculate the new velocity vector, vnew
    // var dv = fnew.clone().multiplyScalar( dt );
    var vnew = electron.velocity.clone().add( fnew );
    
    // apply friction
    // var friction = last_time/( 1 + last_time );
   
    // set vnew to be tangent to the sphere
    vnew.sub( 
        electron.clone().multiplyScalar( 
            electron.dot( vnew ) 
    )).multiplyScalar( intensity );
    
    // calculate change in the electron's position
    var dx = vnew.clone().multiplyScalar( dt );
    
    // update the electron to its new position
    // both the force vector and the velocity vector move it off the sphere, so normalize it too
    electron.add( dx ).normalize();
    
    // set its velocity for next time
    electron.velocity.set( vnew.x, vnew.y, vnew.z ).normalize();
}
/* 
 * Draws the lines after the connect btn is clicked.
 *
 * This is not yet optimized!
 */
function draw_lines(){
    draw=!draw;
    if ( !draw ) {
        geo_container.remove( line );
        return;
    }
    
    var area = Math.PI * (RADIUS * RADIUS );
    var min_distance = (area/shown_electrons);
    var geo = new THREE.Geometry();
    
    // add the vertices to the object if their distance to one another 
    // is roughly equal to min_distance
    for ( var i=0; i<shown_electrons; i++ ){
         for ( var w=(i+1); w<shown_electrons; w++ ){
            var dist = electrons[i].distanceTo( electrons[w] );
            if ( dist - min_distance < RADIUS ){
                geo.vertices.push( electrons[i].clone() );
                geo.vertices.push( electrons[w].clone() );
            }
         }
    }
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    line = new THREE.Line(geo, material);
    geo_container.add(line);
}

// initializers for the geometric objects -----------------------------
function create_platonic(){

    electron_system = new THREE.Geometry();
    electrons = electron_system.vertices;
    
    var system=new THREE.ParticleSystem( 
            electron_system,
            new THREE.ParticleBasicMaterial({
                wireframe:          true,
                size:               RADIUS/4,
                map:                THREE.ImageUtils.loadTexture(
                                        "images/particle.png" ),
                blending:           THREE.AdditiveBlending,
                transparent:        true,
                depthWrite:		    false
        })
    );
    
    // add all of the vertices now, because it is too costly
    // to add vertices dynamically, so is unsupported by three.js     
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
            size:               RADIUS/10,
            color:              0x6D4CFF
        })
    );
    
    var distance=RADIUS*10;
    for (var i=0; i<1000; i++)
        background.geometry.vertices.push( new Star( distance ) );
    
    return background;
}

