// plot
// Version vom 5. 6. 2011
// J�rgen Berkemeier
// www.j-berkemeier.de
var plot = function(feld,xstr,ystr) {
  var ticwidth=1,linewidth=1,borderwidth=1;
  var JB_log10 = function(x) { return Math.log(x)/Math.LN10; }
  var JB_toString = function(n) { return Math.abs(n)<1e-15?"0":Number(n.toPrecision(15)).toString(10); }
  var JB_makediv = function(parentnode,id,x,y,w,h) {
    var ele = document.createElement("div");
    ele.style.position = "absolute";
    if(typeof id == "string" && id.length) ele.id = id;
    if(typeof x == "number") ele.style.left = x + "px";
    if(typeof y == "number") ele.style.top = y + "px";
    if(typeof w == "number") ele.style.width = w + "px";
    if(typeof h == "number") ele.style.height = h + "px";
    parentnode.appendChild(ele);
    return ele;
  }
  if(typeof feld == "string") feld = document.getElementById(feld);
  var xobj = xstr?xstr:"x";
  var yobj = ystr?ystr:"y";
  var xmin=0,xmax=0,ymin=0,ymax=0;
  var xfak=0,yfak=0;
  var dx,dy,fx,fy;
  var gr = null;
  var xlabel = null;
  var ylabel = null;
  var w = parseInt(feld.offsetWidth-1);
  var h = parseInt(feld.offsetHeight-1);
  var marker;
  var ifeld = JB_makediv(feld,"","","",w,h);

  this.scale = function(a) {
    if(xmin==xmax) {
      xmax = xmin = a[0][xobj];
      ymax = ymin = a[0][yobj];
    }
    for(var i=0;i<a.length;i++) {
      var t = a[i];
      if(t[xobj]<xmin) xmin = t[xobj];
      if(t[xobj]>xmax) xmax = t[xobj];
      if(t[yobj]<ymin) ymin = t[yobj];
      if(t[yobj]>ymax) ymax = t[yobj];
    }
  } // plot.scale
  this.clear = function() {
    ifeld.innerHTML = "";
    xmax = xmin = ymax = ymin = xfak = yfak = 0;
  } // plot.clear
  this.frame = function(x0,y0,xl,yl) {
    if(xmax==xmin) { xmin -= 0.5; xmax += 0.5; }
    dx = (xmax - xmin)/100; xmin -= dx; xmax += dx;
    dx = xmax - xmin;
    fx = Math.pow(10,Math.floor(JB_log10(dx))-1);
    xmin = Math.floor(xmin/fx)*fx;
    xmax = Math.ceil(xmax/fx)*fx;
    if(ymax==ymin) { ymin -= 0.5; ymax += 0.5; }
    dy = (ymax - ymin)/100; ymin -= dy; ymax += dy;
    dy = ymax - ymin;
    fy = Math.pow(10,Math.floor(JB_log10(dy))-1);
    ymin = Math.floor(ymin/fy)*fy;
    ymax = Math.ceil(ymax/fy)*fy;
    ifeld.innerHTML = "";
    this.pele = JB_makediv(ifeld,"",x0,0,w-x0,h-y0);
    if(xl.length) xlabel=new gra(JB_makediv(ifeld,"",x0,h-y0,w-x0,y0));
    ylabel=new gra(JB_makediv(ifeld,"",0,0,x0,h-y0));
    gr=new gra(this.pele);
    gr.setbuf(1000);
    xfak = gr.w/(xmax-xmin);
    yfak = gr.h/(ymax-ymin);
    if(xl.length) xlabel.text(xlabel.w/2,0,".9em","black",xl,"mu");
    if(yl.length) ylabel.text(10,ylabel.h/2,".9em","black",yl,"mm");
    var tx = 100*dx/gr.w;
    var ty = gr.h<250 ?  50*dy/gr.h : 100*dy/gr.h;
    var tx10 = Math.pow(10,Math.floor(JB_log10(tx)));
    tx = Math.round(tx/tx10);
    var ty10 = Math.pow(10,Math.floor(JB_log10(ty)));
    ty = Math.round(ty/ty10);
    tx = Number(String(tx).replace(/3/,"2").replace(/[4567]/,"5").replace(/[89]/,"10"));
    ty = Number(String(ty).replace(/3/,"2").replace(/[4567]/,"5").replace(/[89]/,"10"));
    tx *= tx10;
    ty *= ty10;
    var mxmin = Math.ceil(xmin/tx)*tx;
    var mymin = Math.ceil(ymin/ty)*ty;
    gr.setwidth(ticwidth);
    for(var x=mxmin;x<=xmax;x+=tx) {
      var xx = (x-xmin)*xfak;
      gr.linie(xx,0,xx,gr.h,"gray");
      if(xl.length && xx<(gr.w-5) && xx>5) xlabel.text(xx,xlabel.h,".8em","black",JB_toString(x),"mo");
    }
    for(var y=mymin;y<=ymax;y+=ty) {
      var yy = (y-ymin)*yfak;
      gr.linie(0,yy,gr.w,yy,"gray");
      if(yl.length && yy<(gr.h-5) && yy>5) ylabel.text(ylabel.w,yy,".8em","black",JB_toString(y),"rm");
    }
    gr.setwidth(linewidth);
    var rahmen=new gra(this.pele);
    rahmen.setwidth(borderwidth);
    rahmen.linie(       0,       0,rahmen.w,       0,"black");
    rahmen.linie(rahmen.w,       0,rahmen.w,rahmen.h,"black");
    rahmen.linie(rahmen.w,rahmen.h,       0,rahmen.h,"black");
    rahmen.linie(       0,rahmen.h,       0,       0,"black");
    this.mele = JB_makediv(ifeld,"",x0,0,w-x0,h-y0);
    if(gr.canvas) this.mele.style.backgroundColor = "rgba(255,255,255,0)"; // f�r den IE9 RC, ohne kein "onmouseover" etc.
  } // plot.frame
  this.plot = function(a,col) {
    for(var i=0;i<a.length-1;i++)
      gr.linie(
       (a[i][xobj]-xmin)*xfak,
       (a[i][yobj]-ymin)*yfak,
       (a[i+1][xobj]-xmin)*xfak,
       (a[i+1][yobj]-ymin)*yfak,
       col);
    gr.flush();
  } // plot.plot)
  this.showmarker = function(markertype) {
    if(markertype=="Punkt") {
      marker = JB_makediv(this.pele,"","","","","");
      marker.style.fontSize = "32px";
      var txt=document.createTextNode(String.fromCharCode(8226)) ; // Kreis als Zeichen: &bull; oder &#8226; evtl auch 8729
      marker.appendChild(txt);
    }
    else {
      marker = JB_makediv(this.pele,"","",0,1,gr.h);
      marker.style.backgroundColor = "black";
    }
    marker.style.display = "none";
  } // plot.showmarker
  this.hidemarker = function() {
    marker.style.display = "none";
    delete marker;
  } // plot.hidemarker
  this.setmarker = function(a,markertype) {
    marker.style.display = "";
    if(markertype=="Punkt") {
      marker.style.left = Math.round((a[xobj]-xmin)*xfak) - marker.offsetWidth/2 + "px";
      marker.style.top = Math.round(gr.h - (a[yobj]-ymin)*yfak) - marker.offsetHeight/2 + "px";
    }
    else {
      marker.style.left = Math.round((a[xobj]-xmin)*xfak) + "px";
    }
  } // plot.setmarker
  this.markeron = function(a,callback_over,callback_out,callback_move,markertype) {
    var dieses = this;
    var posx=0;
    this.mele.onmouseover = function(e) {
      if(!e) e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
      dieses.mele.onmousemove = function(e) {
        if(!e) e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        posx = e.layerX ? e.layerX : e.offsetX;
        var x = posx/xfak+xmin;
        var al = a.length;
        var p,pi;
        if(x<=a[0][xobj]) pi=0;
        else if(x>=a[al-1][xobj]) pi=al-1;
        else {
          p = al/2;
          pi = Math.floor(p);
          var dp = Math.ceil(p/2);
          do {
            var apx = a[pi][xobj];
            if(x<apx) { p -= dp; if(p<0) p=0; }
            else if(x>apx) { p += dp; if(p>al-1) p=al-1; }
            else break;
            pi = Math.floor(p);
            dp = dp/2;
          } while(dp>=0.5) ;
        }
        dieses.setmarker(a[pi],markertype);
        if(callback_move && typeof(callback_move)=="function") callback_move(pi,a[pi]);
        return false;
      }
      if(callback_over && typeof(callback_over)=="function") callback_over();
      return false;
    } 
    this.mele.onmouseout = function(e) {
      if(!e) e = window.event;
      dieses.hidemarker();
      dieses.mele.onmousemove = null;
      if(callback_out && typeof(callback_out)=="function") callback_out();
      return false;
    }
  } // plot.markeron
  this.markeroff = function() {
    this.pele.onmousemove = null;
    this.pele.onmouseout = null;
  } // plot.markeroff
} // plot
