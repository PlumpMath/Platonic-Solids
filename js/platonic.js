
/*
* Nick Sullivan
* http://github.com/ncksllvn
* file: platonic.js
*
* This file contains only the primary/fun functions that manipulate the vertices.
* The controls file has (mostly) everything that deals with user interaction, including
* how the sphere is rotated, and the onscreen slider.
*
* Note that this project uses the amazing THREE.js (https://github.com/mrdoob/three.js/)
*/

var geo_container, sphere, platonic;        // main geometric objects
var camera, scene, renderer;                // see THREE.js documentation
var windowHalfX = window.innerWidth / 2;    // for maintaining the aspect ratio
var windowHalfY = window.innerHeight / 2;   
var rotation_matrix=new THREE.Matrix4();    // for rotating the geometry
var SENSITIVITY=0.005;                      // change this to adjust dragging sensitivity
var MAX_SPEED=25;                           // change this to adjust speed of zoom-in/out
var RADIUS=100;                             // the radius of the circle. used in more placed than just that
var MAX_VERTICES=20;                        // the maximum allowed vertices to be displayed on screen
var MIN_VERTICES=3;                         // the minimum allowed amt of vertices to be displayed on screen
var SHOWN_VERTICES=3;                       // how many vertices are currently shown
var DEFAULT_SPEED=30;                       // starting speed of vertices
var VERTEX_MOVEMENT_SPEED=30;               // current speed of vertices
    
init();
on_enter_frame();

/*
 * large function that does all of the necessary setting up for THREE.js
 */
function init(){
    scene=new THREE.Scene();                                     // holds all geometry
    renderer = new THREE.WebGLRenderer();                        // renders the scene
    renderer.setSize( window.innerWidth, window.innerHeight );   // sets the screen size
    document.body.appendChild( renderer.domElement );            // appends the renderer - a <canvas> - to the scene
    
    camera = new THREE.PerspectiveCamera(       // most common type of camera
        60,                                     // field of view
        window.innerWidth / window.innerHeight, // aspect ratio: always use this, or else it'll look squished
        1,                                      // near clipping-plane: objects closer than this won't be rendered
        10000                                   // far clipping-plane: objects further away won't be rendered
    );
    
    sphere = new THREE.Mesh( new THREE.SphereGeometry(
            RADIUS*.90,                                              // radius
            20,                                                      // # of segments along width
            20                                                       // # of segments along height
        ), new THREE.MeshBasicMaterial({                             // fill in the sphere with a material
            color:              0x057d9f,
            wireframe:          true,
            wireframeLinewidth: 2
        }) 
    );  
    
    platonic=new THREE.ParticleSystem( new THREE.Geometry(),         // the container for our particles
        new THREE.ParticleBasicMaterial({                            // that we will manipulate later
            wireframe:          true,
            size:               25,
            map:                THREE.ImageUtils.loadTexture(
                                    "images/particle.png"
                                ),
            blending:           THREE.AdditiveBlending  ,
            transparent:        true
            //vertexColors:        true
        }) 
    );    

    /* fill up platonic with vertices */
    init_platonic();

    /* create a container for mouse drag rotations */
    geo_container = new THREE.Object3D();  
    geo_container.add( sphere );
    geo_container.add( platonic );
    
    /* add that container to the scene */
    scene.add( geo_container );
    
    /* set up camera */
    camera.position.z = -RADIUS*2.5;
    camera.lookAt( scene.position );

}

/* 
 * called every frame of animation
 * tradition as3 name for the function called every frame (~60 fps)
 */
function on_enter_frame(){

    /* request this function again for the next frame */
    requestAnimationFrame( on_enter_frame );
    
    /* rotate the sphere (see controls.js) */
    if (mouse.is_dragging){
        geo_container.applyMatrix( rotation_matrix );
        rotation_matrix.identity();
    }
    
    /* animate those particles that need animating */
    platonic.geometry.vertices.slice( 0, SHOWN_VERTICES ).forEach(update_position);
    
    /* inform THREE.js that we've moved the particles */
    platonic.geometry.verticesNeedUpdate=true;

    /* deal with camera movement (see controls.js) */
    //camera.position.z += camera_controls.velocity_z;
    
    /* rotate the sphere */
    sphere.rotation.y-=0.003;
    
    /* let the renderer do its thing */
    renderer.render( scene, camera );
}

/*
 * the fun part
 * controls all of the vertices that should be updated
 */
function update_position(vertex, index){

    // loop through all the vertices, applying their "push" to this vector
    platonic.geometry.vertices.slice( index, SHOWN_VERTICES ).forEach( 
        function(other_vertex, indexOfother_vertex){
        
            var intensity = Math.inverse( vertex.distanceToSquared( other_vertex ) ) * VERTEX_MOVEMENT_SPEED;
            
            var other_vertex_force = other_vertex.clone()
                .multiplyScalar( intensity )
                .negate();
            
            var this_vertex_force = vertex.clone()
                .multiplyScalar( intensity )
                .negate();
            
            other_vertex.add( this_vertex_force );
            vertex.add( other_vertex_force );
    });
    // move the vertex back onto the sphere
    vertex.show();
}


/*
 * fills our platonic array with lots of particles
 * NOTE the way this is working:
 * I am adding maximum amount of vertices to our platonic geometry now,
 * because vertices added during runtime are very costly. So, the ones that
 * are not shown are simply moved off screen and are not interacted with by 
 * other vertices.
 */

function init_platonic(){
    for (var i=0; i<MAX_VERTICES; i++){
        platonic.geometry.vertices.push( new THREE.Vector3.random(i) );
        if (i<SHOWN_VERTICES)
            platonic.geometry.vertices[i].show();
        else
            platonic.geometry.vertices[i].be_gone();
    }
}



