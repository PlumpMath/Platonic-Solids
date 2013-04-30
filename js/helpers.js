/*
 * Nick Sullivan
 * http://github.com/ncksllvn
 * helpers.js
 */


Math.inverse=function( num ){
    if ( num==0 )
        return 0;
    return (1/num);
}

Function.prototype.extends=function( superClass ){
    var F=function(){};
    F.prototype=superClass.prototype;
    this.prototype=new F();
    this.prototype.constructor=this;
}