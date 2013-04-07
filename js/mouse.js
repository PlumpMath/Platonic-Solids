
/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * mouse.js
 * creates a mouse object that imitates the ondrag event.
 */


var mouse={
    is_dragging: false,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
};
    
(function(){
    var omd_event=new CustomEvent( 
        "onmousedrag" );
    function on_mouse_down(event){
        mouse.is_dragging=true,
        mouse.dx=event.clientX,
        mouse.dy=event.clientY;
    }
    function on_mouse_up(){
        mouse.is_dragging=false,
        mouse.dx=0, mouse.dy=0;
    }
    function on_mouse_move(event){
        mouse.x=event.clientX,
        mouse.y=event.clientY;
        if (mouse.is_dragging){
            mouse.dx=mouse.x - mouse.dx,
            mouse.dy=mouse.y - mouse.dy,
            document.dispatchEvent( omd_event );
            mouse.dx=event.clientX,
            mouse.dy=event.clientY;
        }
    }
    document.addEventListener( 'mousedown', on_mouse_down, false );
    document.addEventListener( 'mouseup', on_mouse_up, false );
    document.addEventListener( 'mousemove', on_mouse_move, false );
})();

