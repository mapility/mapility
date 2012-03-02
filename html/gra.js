var JB_canvas=false;
(function() {
  var cv,ct;
  cv = document.createElement("canvas");
  if(cv) {
    if (cv.getContext) ct = cv.getContext("2d");
    if(ct) JB_canvas = true;
    if(JB_canvas) {
      if(!ct.fillRect) JB_canvas = false;
      if(!ct.fillText) JB_canvas = false;
    }
    delete ct;
  }
  delete cv;
//  if(JB_canvas) document.write('<script src="gra_canvas.js"><\/script>');
//  else          document.write('<script src="gra_div.js"><\/script>');
})();

if(JB_canvas)
{
// BEGIN: gra_canvas.js
// gra_canvas
// Version vom 27. 2. 2011
// Jürgen Berkemeier
// www.j-berkemeier.de
var gra = function(gradiv) {
 this.canvas = true;
 if(typeof gradiv == "string") gradiv = document.getElementById(gradiv);
 var getCurrentStyle = function(element,cssPropertyName) {
  if (window.getComputedStyle)
   return window.getComputedStyle(element,'').getPropertyValue(cssPropertyName.replace(/([A-Z])/g,"-$1").toLowerCase());
  else if (element.currentStyle) return element.currentStyle[cssPropertyName];
  else return "";
 }
 var foo=getCurrentStyle(gradiv,"width");
 var foo=getCurrentStyle(gradiv,"width");
 this.w = parseInt(getCurrentStyle(gradiv,"width"));  //gradiv.offsetWidth;
 this.h = parseInt(getCurrentStyle(gradiv,"height")); //gradiv.offsetHeight;
 cv = document.createElement("canvas");
 cv.width = this.w;
 cv.height = this.h;
 cv.style.position = "absolute";
 gradiv.appendChild(cv);
 this.context = cv.getContext("2d"); 
 this.w = this.context.canvas.width;
 this.h = this.context.canvas.height;
 this.linewidth = 1;
 this.context.lineWidth = 1;
 var xoff=0,yoff=0;
 this.setwidth=function(w) {
  this.linewidth = w;
  this.context.lineWidth = w;
  xoff = (w-1)/2;
  yoff = (w-1)/2;
  return;
 }
 this.setbuf=function(siz) {
  return;
 }
 this.flush=function() {
  return;
 }
 this.punkt=function(x,y,c) {
  this.context.fillStyle = c;
  this.context.fillRect(x-xoff,this.h-y+yoff,this.linewidth,this.linewidth);
 } // punkt
 this.ver_linie=function(x,y1,y2,c) {
  this.linie(x,this.h-y1,x,this.h-y2,c);
 } // ver_linie
 this.hor_linie=function(x1,x2,y,c) {
  this.linie(x1,this.h-y,x2,this.h-y,c);
 } // hor_linie
 this.linie=function(xs,ys,xe,ye,c) {
  xs=Math.round(xs); xe=Math.round(xe);
  ys=Math.round(ys); ye=Math.round(ye);
  this.context.strokeStyle = c;
  this.context.beginPath();
	this.context.moveTo(xs,this.h-ys);
	this.context.lineTo(xe,this.h-ye);
  this.context.closePath();
  this.context.stroke();
 } // linie
 this.text=function(x,y,size,color,text,align) {
  var align_h = "m";
  var align_v = "m";
  if(align && align.length) {
   align_h = align.substr(0,1);
   if(align.length>1) align_v = align.substr(1,1);
  }
  this.context.save();
  this.context.translate(x,this.h-y);
  if(text.search("<br />")!=-1) {
    this.context.rotate(1.5*Math.PI);
    text = " "+text.replace(/<br \/>/g," ").replace(/\&nbsp;/g," ").replace(/  /g," ")+" ";
  }
  switch(align_h) {
   case "l": this.context.textAlign = "start"; break;
   case "m": this.context.textAlign = "center"; break;
   case "r": this.context.textAlign = "end"; break;
   default:  this.context.textAlign = "start"; break;
  }
  switch(align_v) {
   case "o": this.context.textBaseline = "top" ; break;
   case "m": this.context.textBaseline = "middle" ; break;
   case "u": this.context.textBaseline = "bottom" ; break;
   default:  this.context.textBaseline = "bottom" ; break;
  }
  this.context.font = size+" sans-serif";
  this.context.fillStyle = color;
  this.context.fillText(text,0,0);
  this.context.restore();
  return;
 } // text
 this.del=function() {
  this.context.clearRect(0, 0, this.w, this.h);
 } // del
} // gra

// END: gra_canvas.js
} else {
// BEGIN: gra_div.js

// gra
// Version vom 14. 1. 2011
// Jürgen Berkemeier
// www.j-berkemeier.de
var gra = function(feld) {
 if(typeof feld == "string") feld = document.getElementById(feld);
 var dv=document.createElement("div");
 var cont=feld.appendChild(dv);
 var buf=document.createElement("div");
 this.w=parseInt(feld.offsetWidth-1);
 this.h=parseInt(feld.offsetHeight-1);
 var maxbuf=1;
 var bufsize=1;
 var sp = document.createElement("div");
 var col="#000000";
 var off=0;
 sp.style.position="absolute";
 sp.style.width="1px";
 sp.style.height="1px";
 sp.style.overflow="hidden";
 sp.style.left="0px";
 sp.style.top="0px";
 sp.style.backgroundColor=col;
 this.setwidth=function(w) {
  off = -w/2;
  sp.style.width = w + "px";
  sp.style.height = w + "px";
 }
 this.setbuf=function(siz) {
  bufsize=maxbuf=Math.max(1,siz);
 }
 this.flush=function() {
  cont.appendChild(buf);
  buf=document.createElement("div");
  bufsize=maxbuf;
 }
 this.punkt=function(x,y,c) {
  if (x<0 || y<0 || x>this.w || y>this.h) return;
  if(c!=col) {col=c;sp.style.backgroundColor=col;}
  var pkt = sp.cloneNode(true);
  pkt.style.left=Math.round(x+off)+"px";
  pkt.style.top=Math.round(this.h-y+off)+"px";
  buf.appendChild(pkt);
  bufsize--; if(!bufsize) this.flush();
 } // punkt
 this.ver_linie=function(x,y1,y2,c) {
  if (x<0 || x>this.w) return;
  if ( (y1<0&&y2<0) || (y1>this.h&&y2>this.h) ) return;
  if(c!=col) {col=c;sp.style.backgroundColor=col;}
  y1=Math.max(0,Math.min(this.h,y1));
  y2=Math.max(0,Math.min(this.h,y2));
  var vl = sp.cloneNode(true);
  vl.style.left=Math.round(x+off)+"px";
  vl.style.top=Math.round(this.h-Math.max(y1,y2))+"px";
  vl.style.height=Math.round(Math.abs(y2-y1)+1)+"px";
  buf.appendChild(vl);
  bufsize--; if(!bufsize) this.flush();
 } // ver_linie
 this.hor_linie=function(x1,x2,y,c) {
  if (y<0 || y>this.h) return;
  if ( (x1<0&&x2<0) || (x1>this.w&&x2>this.w) ) return;
  if(c!=col) {col=c;sp.style.backgroundColor=col;}
  x1=Math.max(0,Math.min(this.w,x1));
  x2=Math.max(0,Math.min(this.w,x2));
  var hl = sp.cloneNode(true);
  hl.style.left=Math.round(Math.min(x1,x2))+"px";
  hl.style.top=Math.round(this.h-y+off)+"px";
  hl.style.width=Math.round(Math.abs(x2-x1)+1)+"px";
  buf.appendChild(hl);
  bufsize--; if(!bufsize) this.flush();
 } // hor_linie
 this.linie=function(xs,ys,xe,ye,c) {
//  var flag=(maxbuf==1);
//  if(flag) maxbuf=1000;
  xs=Math.round(xs); xe=Math.round(xe);
  ys=Math.round(ys); ye=Math.round(ye);
  var dx=xe-xs;
  var dy=ye-ys;
  if (dx==0 && dy==0) this.punkt(xs,ys,c)
  else if (dx==0) this.ver_linie(xs,ys,ye,c);
  else if (dy==0) this.hor_linie(xs,xe,ys,c);
  else {
   var adx=Math.abs(dx);
   var ady=Math.abs(dy);
   var d=Math.min(adx,ady);
   dx=dx/d;
   dy=dy/d;
   if (adx==ady) {
    for(var x=xs,y=ys,i=0;i<=d;x+=dx,y+=dy,i++) this.punkt(x,y,c) ;
   }
   else if (adx<ady) {
    var dd=dy/Math.abs(dy);
    this.ver_linie(xs,ys,ys+dy/2-dd,c);
    for(var x=xs+dx,y=ys+dy/2,i=1;i<d;x+=dx,y+=dy,i++) this.ver_linie(x,y,y+dy-dd,c) ;
    this.ver_linie(xe,ye-(dy+dd)/2,ye,c);
   }
   else {
    var dd=dx/Math.abs(dx);
    this.hor_linie(xs,xs+dx/2-dd,ys,c);
    for(var x=xs+dx/2,y=ys+dy,i=1;i<d;x+=dx,y+=dy,i++) this.hor_linie(x,x+dx-dd,y,c) ;
    this.hor_linie(xe-(dx+dd)/2,xe,ye,c);
   }
  }
//  if(flag) {maxbuf=1;this.flush();}
 } // linie
 this.text=function(x,y,size,color,text,align) {
  var align_h = "m";
  var align_v = "m";
  if(align && align.length) {
   align_h = align.substr(0,1);
   if(align.length>1) align_v = align.substr(1,1);
  }
  var pkt = document.createElement("div");
  pkt.style.position = "absolute";
  if(!isNaN(size)) size += "px"; 
  pkt.style.fontSize = size;
  pkt.style.textAlign = "center";
  pkt.style.color = color;
  pkt.innerHTML = text;
  cont.appendChild(pkt);
  switch(align_h) {
   case "l": default: pkt.style.left = Math.round(x) + "px"; break;
   case "m": pkt.style.left = Math.round(x) - pkt.offsetWidth/2 + "px"; break
   case "r": pkt.style.left = Math.round(x) - pkt.offsetWidth + "px"; break
  }
  switch(align_v) {
   case "o": default: pkt.style.top = Math.round(this.h-y) + "px"; break;
   case "m": pkt.style.top = Math.round(this.h-y) - pkt.offsetHeight/2 + "px"; break;
   case "u": pkt.style.top = Math.round(this.h-y) - pkt.offsetHeight + "px"; break;
  }
 } // text
 this.del=function() {
  feld.removeChild(cont);
  delete cont;
  delete buf;
  var dv=document.createElement("div");
  cont=feld.appendChild(dv);
  buf=document.createElement("div");
  bufsize=maxbuf;
 } // del
} // gra

} // END: gra_div.js
