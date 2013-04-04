
/*
* author: Nick Sullivan
* file: platonic.js
*/

var geo_container, sphere, platonic;        // main geometric objects
var camera, scene, renderer;                // 
var windowHalfX = window.innerWidth / 2;    // for maintaining the aspect ratio
var windowHalfY = window.innerHeight / 2;   
var rotation_matrix=new THREE.Matrix4();    // for rotating the geometry
var SENSITIVITY=0.005;                      // change this to adjust dragging sensitivity
var MAX_SPEED=25;                           // change this to adjust speed of zoom-in/out
var RADIUS=100;
var MAX_VERTICES=20;
var MIN_VERTICES=3;
var SHOWN_VERTICES=3;
var VERTEX_MOVEMENT_SPEED=250;              // change this to adjust speed of vertices
    
init();
on_enter_frame();

/*
 * large function that does all of the necessary setting up
 */
function init(){
    scene=new THREE.Scene();
    camera = new THREE.PerspectiveCamera(       // most common type of camera
        60,                                     // field of view
        window.innerWidth / window.innerHeight, // aspect ratio: always use this, or else it'll look squished
        1,                                      // near clipping-plane: objects closer than this won't be rendered
        10000                                   // far clipping-plane: objects further away won't be rendered
    );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );   // set pixel size; innerWidth/2 will be 1/2 the resolution
    document.body.appendChild( renderer.domElement );            // appends the renderer - a <canvas> - to the scene
    
    sphere = new THREE.Mesh( new THREE.SphereGeometry(
            RADIUS*.95,                                              // radius
            20,                                                      // # of segments along width
            20                                                       // # of segments along height
        ), new THREE.MeshBasicMaterial({                             // fill in the sphere with a material
            color:              0x0000ff,                            // color of the sphere
            wireframe:          true,
            wireframeLinewidth: 1
        }) 
    );  
    
    platonic=new THREE.ParticleSystem( new THREE.Geometry(), 
        new THREE.ParticleBasicMaterial({
            color:              0x99ff99,
            wireframe:          true,
            wireframeLineWidth: 5,
            size:               10
        }) 
    );
    
    platonic.geometry.dynamic = true;
    init_platonic();
	geo_container = new THREE.Object3D();  
    geo_container.add( sphere );
    geo_container.add( platonic );
    scene.add( geo_container );
    camera.position.z = -RADIUS*2.5;
    camera.lookAt( scene.position );
    document.addEventListener( 'keydown', on_key_down, false );
    document.addEventListener( 'keyup', on_key_up, false );
    document.addEventListener( 'onmousedrag', on_mouse_drag, false );
    window.addEventListener( 'resize', on_window_resize, false ); 
}

/* 
 * called every frame of animation
 * tradition as3 name for the function called every frame (~60 fps)
 */
function on_enter_frame(){

    /* request this function again for the next iteration */
    requestAnimationFrame( on_enter_frame );
    
    /* rotate the sphere */
    if (mouse.is_dragging)
        geo_container.applyMatrix( rotation_matrix );
    
    /* animate those particles that need animating */
    platonic.geometry.vertices.slice( 0, SHOWN_VERTICES ).forEach(update_position);
    platonic.geometry.vertices.slice( 0, SHOWN_VERTICES ).keepOnSphere();
    
    /* inform THREE.js that we've moved the particles */
    platonic.geometry.verticesNeedUpdate=true;
    
    /* deal with camera movement (see controls.js) */
    camera.position.z += camera_controls.velocity_z;
    
    /* rotate the sphere */
    //sphere.rotation.y-=0.003;
    
    /* let the renderer do its thing */
    renderer.render( scene, camera );
}

/*
 * the fun part
 * controls all of the vertices that should be updated
 */
function update_position(vertex, index){
    var sumOfVecs = new THREE.Vector3();
    platonic.geometry.vertices.slice( 0, SHOWN_VERTICES ).forEach( 
        function(otherVertex, indexOfOtherVertex){
            var intensity =  Math.inverse( vertex.distanceToSquared( otherVertex ) );
            var copy=otherVertex.clone().multiplyScalar( intensity*VERTEX_MOVEMENT_SPEED ).negate();
            vertex.add( copy );
            otherVertex.add( copy );
    });
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
        if (i<SHOWN_VERTICES)
            platonic.geometry.vertices.push( 
                new Spherical( Math.random()*200-100, Math.random()*200-100 )
            );
        else
            platonic.geometry.vertices.push( 
                new THREE.Vector3( -1000, -1000, -1000 )
            );
    }

}



