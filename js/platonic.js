
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
var MAX_VERTICES=64;
var MIN_VERTICES=3;
var SHOWN_VERTICES=3;
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
            RADIUS*.95,                                                  // radius
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


// tradition as3 name for the function called every frame (~60 fps)
function on_enter_frame(){
    requestAnimationFrame( on_enter_frame );
    if (mouse.is_dragging)                 // rotate the sphere?
        geo_container.applyMatrix( rotation_matrix );
    platonic.geometry.vertices.forEach(update_position);
    platonic.geometry.verticesNeedUpdate=true;
    camera.position.z += camera_controls.velocity_z;
    sphere.rotation.y-=0.003;
    renderer.render( scene, camera );
}

function init_platonic(){
    for (var i=0; i<MAX_VERTICES; i++){
        if (i<SHOWN_VERTICES)
            platonic.geometry.vertices.push( 
                new Spherical( Math.random()*200-100, Math.random()*200-100 )
            );
        else
            platonic.geometry.vertices.push( 
                new THREE.Vector3( rand(), rand(), rand() )
            );
    }
        //for (var i=2; i<MAX_VERTICES; i++)
    //    platonic.geometry.vertices.faces.push( new THREE. Face3( i-2, i-1, i ) );
}

function update_position(vertex, index){
    if (index<SHOWN_VERTICES)
        vertex.add_spherical( Math.random()*3, Math.random()*2 );
}
function add_vertex(){
    if (SHOWN_VERTICES<MAX_VERTICES){
        platonic.geometry.vertices[SHOWN_VERTICES].spherical(90, Math.random()*360-180);
        SHOWN_VERTICES++;
    }
}

function remove_vertex(){   
    if (SHOWN_VERTICES>MIN_VERTICES){
        SHOWN_VERTICES--;
        platonic.geometry.vertices[SHOWN_VERTICES].x=rand(),
        platonic.geometry.vertices[SHOWN_VERTICES].y=rand(),
        platonic.geometry.vertices[SHOWN_VERTICES].z=rand();
        console.log( platonic.geometry.vertices[SHOWN_VERTICES] );
    }
}
function rand(){
    return Math.random()*800-400;
}






