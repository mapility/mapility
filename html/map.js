function in_array(item,arr){for(p=0;p<arr.length;p++)if(item==arr[p])return true;return false;}
function getObjectClass(o){if (o&&o.constructor&&o.constructor.toString){var a=o.constructor.toString().match(/function\s*(\w+)/);if(a&&a.length==2){return a[1];}}return undefined;}
function getProps(o){var tmp=[];for(var p in o){tmp.push(typeof(o[p])+' '+p);};return tmp.join(',');};
function getPropsA(o){var tmp=[];for(var p in o){if(typeof(o[p])!='function')tmp.push(p+' '+o[p]);};return tmp.join(',');};
function arrDelete(arr,v) {for(i=0;i<arr.length;i++)if(arr[i]==v){arr.splice(i,1);return true;}return false;}

function GMapHash(){this.length=0;this.items=new Array();for(var i=0;i<arguments.length;i+=2){if(typeof(arguments[i+1])!='undefined'){this.items[arguments[i]]=arguments[i+1];this.length++;}}this.removeItem=function(in_key){var tmp_value;if(typeof(this.items[in_key])!='undefined'){this.length--;var tmp_value=this.items[in_key];delete this.items[in_key];}return tmp_value;};this.getItem=function(in_key){return this.items[in_key];};this.setItem=function(in_key,in_value){if(typeof(in_value) != 'undefined'){if (typeof(this.items[in_key])=='undefined'){this.length++;}this.items[in_key]=in_value;}return in_value;};this.hasItem=function(in_key){return typeof(this.items[in_key])!='undefined';};this.dump=function(){return this.items.toJSON();};}

// XML writer with attributes and smart attribute quote escaping 

/** 
 * n string name
 * c string text content (optional, may be empty)
 * a obj holding the attributes (optional, may be empty)
 * */
function xmlenc(n,c,a){var A="'";Q='"';var EQ={Q:'&quot;',A:'&apos;'};function fa(a){var av,ap,qp,uq,e,quote_to_escape,as,re;var r='';for(var att in a){av=a[att];ap=av.indexOf(A);qp=av.indexOf(Q);if(ap==-1&&qp==-1){as=' '+att+"='"+av+"'";r+=as;continue;};if(qp!=-1&&qp<ap){uq=A;}else{uq=Q;}e=EQ[uq];re=new RegExp(uq,'g');as=' '+att+'='+uq+av.replace(re,e)+uq;r+=as;}return r;};var as='';if(a){as=fa(a);};var xml;if(!c){x='<'+n+as+'/>';}else{x='<' + n + as + '>' + c + '</'+n+'>';};return x;}
function urlencode(s){return escape(s).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');}
function xmlencode(s){return s.replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');}
function attrsFromNode(n){a={};for(i=0;i<n.attributes.length;i++)a[n.attributes[i].name]=n.attributes[i].value;return a;}

function copyStyle(from, to) {
	var f=from.style;var t=to.style;
	for (var i=f.length; i-->0;)
	{
		var n=f[i];
		t.setProperty(n, f.getPropertyValue(n), priority=f.getPropertyPriority(n));
	}
}

// thanks to http://erik.eae.net/archives/2005/07/03/20.19.18/
if (typeof DOMParser == "undefined")
{
	DOMParser = function () {};
	DOMParser.prototype.parseFromString = function (str, contentType)
	{
		if (typeof ActiveXObject != "undefined")
		{
			var d = new ActiveXObject("MSXML.DomDocument");
			d.loadXML(str);
			return d;
		} else if (typeof XMLHttpRequest != "undefined") {
			var req = new XMLHttpRequest;
			req.open("GET", "data:" + (contentType || "application/xml") +";charset=utf-8," + encodeURIComponent(str), false);
			if (contentType && req.overrideMimeType)
			{
				req.overrideMimeType(contentType);
			}
			req.send(null);
			return req.responseXML;
		}
	};
}



// KEEP THIS TOP!
var sBaseHref = document.getElementsByTagName("base")[0].getAttribute("href");
var map_debug=false;

(function(){
var ContaoMapping = this.ContaoMapping = {
	debug: function()
	{
		if(console)
			console.log(arguments);
	},
	dynLoad:new (function()
	{
		var me=this;
		var libs_ = [];
		var running = false;
		// add lib to stack
		me.addLib = function(lib){
			libs_.push(lib);
			if(!running)
				me.loadNext();
		};
		// load next lib from stack
		me.loadNext = function()
		{
			// wait for google api to come available as we might be loaded via combined script.
			if(typeof(google.maps)=='undefined')
			{
				dynLoad.loadNext.delay(100);
				return;
			}
			running = true;
			if(libs_.length==0)
			{
				running = false;
				return;
			}
			var getElem=function()
			{
				var e = document.createElement("script");
				e.type="text/javascript";
				return e;
			};
			var scriptLoaded=function(e)
			{
				if((!e)
				|| (e.srcElement && (src.erase(e.srcElement.src).length==0)) // webkit, Chrome
				|| (e.target && (src.erase(e.target.src).length==0)) // FF - mozilla
				|| (e.src && (src.erase(e.src).length==0)) // IE
				)
				{
					if(callback)
						callback(next);
					me.loadNext();
				}
		};
			var next=libs_.shift();
			var src=next.src;
			var callback = (next.callback)?next.callback:null;
			if(src)
			{
				if(!(src instanceof Array))
					src=[src];
				var loadPending=false;
				src.each(
					function(s)
					{
						if(me.hasLib(s))
						{
							src.erase(s);
						} else {
							var e = getElem();
							loadPending=true;
							if (e.onreadystatechange === undefined)
								// Gecko & Opera
								e.onload=scriptLoaded;
							else
								// IE
								e.onreadystatechange= function(){
									if ((this.readyState == 'loaded') || (this.readyState == 'complete')){
										this.onreadystatechange=null;
										scriptLoaded(e);
								}};
							e.src = s;
							document.getElementsByTagName("head")[0].appendChild(e);
						}
					}
				);
				if(!loadPending)
					scriptLoaded();
			} else {
				var e = getElem();
				/* IE does not allow <script> to have children. :( */
				if (null == e.canHaveChildren || e.canHaveChildren) {
					e.appendChild(document.createTextNode(next.code));
				} else {
					e.text = next.code;
				}
				document.getElementsByTagName("head")[0].appendChild(e);
				scriptLoaded();
			}
		};
		me.hasLib = function(lib)
		{
			var libs=document.getElementsByTagName('script');
				for(var i=0;i<libs.length;i++)
				{
					if(libs[i].src==lib)
						return true;
				}
				return false;
		};
	})(), // end dynLoad
	
	/*
	 * Enhance mootools to allow "class originating" events. Stolen from mootools Events and modified.
	 */
	Class: function(opts)
	{

		if(!Events.removeOn)
		{
			Events.removeOn = function(string)
			{
				return string.replace(/^on([A-Z])/, function(full, first){
					return first.toLowerCase();
				});
			};
		}
		var c=new Class(opts);
		c.prototype.fireClassEvent=(function(type, args, delay){
			c.fireClassEvent(type, args, delay);
		});
		c.prototype.debug=ContaoMapping.debug;
		c.extend({
			$events:{},
			addClassEvent: function(type, fn, internal){
				type = Events.removeOn(type);
				this.$events[type] = (this.$events[type] || []).include(fn);
				if (internal) fn.internal = true;
				return this;
			},
			fireClassEvent: function(type, args, delay){
				type = Events.removeOn(type);
				var events = this.$events[type];
				if (!events) return this;
		//		args = Array.from(args);
				events.each(function(fn){
					if (delay) fn.delay(delay, this, args);
					else fn.apply(this, args);
				}, this);
				return this;
			},
			removeClassEvent: function(type, fn){
				type = Events.removeOn(type);
				var events = this.$events[type];
				if (events && !fn.internal){
					var index = events.indexOf(fn);
					if (index != -1) delete events[index];
				}
				return this;
			},
			removeClassEvents: function(events){
				var type;
				if (typeOf(events) == 'object'){
					for (type in events) this.removeEvent(type, events[type]);
					return this;
				}
				if (events) events = Events.removeOn(events);
				for (type in this.$events){
					if (events && events != type) continue;
					var fns = this.$events[type];
					for (var i = fns.length; i--;) if (i in fns){
						this.removeEvent(type, fns[i]);
					}
				}
				return this;
			}
		});
		return c;
	},

	bootMaps: function()
	{
		for(var i=0;i<ContaoMapping.Map.instances.length;i++)ContaoMapping.Map.instances[i].boot();
	},

	$datadrivers:{},
	getDataDriver: function(name)
	{
		// TODO: automatically load data drivers?
		return ContaoMapping.$datadrivers[name];
	},
	registerDatadriver: function(driver)
	{
		ContaoMapping.$datadrivers[driver.prototype.getMime()]=driver;
	}
};
})();


(function(){

ContaoMapping.DataDriver=new ContaoMapping.Class({
	Implements: [Options],

	runningRequests: [],

	/*
	 * either raw or xml
	 */
	bufferType:'raw',
	/*
	 * Mime type this driver accepts.
	 */
	mimeType: '',

	/*
	 * ContaoMapping.Map instance we are tied to.
	 */
	map: null,

	/*
	 * get the url for the current map location
	 */
	getUrl: function()
	{
		var rect = this.options.map.getExtendedBoundsAsUrl();
		if(!rect)
			return;
		var tmpurl=this.options.url+'&area='+urlencode(rect);
		var params=this.options.additionalparams;
		for(var p in params)
		{
			tmpurl=tmpurl+'&'+p+'='+urlencode(params[p]);
		}
		return tmpurl;
	},

	requestStarted: function(xhr)
	{
		this.runningRequests.push(xhr);
		if(this.runningRequests.length==1)
			this.options.map.displayBox("Loading data ...");
	},

	requestDone: function(xhr)
	{
		this.runningRequests.erase(xhr);
		if(this.runningRequests.length==0)
			this.options.map.hideBox();
	},

	makeRequest: function(opts)
	{
		var url = this.getUrl();
		if(!url)
			return;
		var req;
		opts = opts||{};
		var myOpts = {
			url: url,
			onRequest: (function()
				{
					this.requestStarted(req);
				}).bind(this),
			onComplete: (function()
				{
					this.requestDone(req);
				}).bind(this),
			onFailure: (function(xhr)
				{
					this.requestDone(req);
					if(opts.errorcallback)
						opts.errorcallback();
				}).bind(this),
			onSuccess: (function(data, xml)
				{
					var data = this.decodeData(data, xml, req);
					this.options.map.handleMapData.apply(this.options.map, [data]);
					if(opts.callback)
						opts.callback(data);
				}).bind(this)
		};
		opts=Object.merge(myOpts, opts);
		req=new Request(opts);
		if(typeof(REQUEST_TOKEN) != 'undefined')
		{
			req.post(Object.merge({'REQUEST_TOKEN': REQUEST_TOKEN}, opts.data));
		} else {
			req.post(opts.data);
		}
		return req;
	},

	loadMapData:function(opts)
	{
		opts = opts||{};
		var myOpts = {
			'data': {'known': this.options.map.assembleKnownIds()},
			'evalResponse': false
		};
		this.makeRequest(Object.merge(myOpts, opts));
	},

	initialize: function(options)
	{
		//this.setOptions(options);
		// mootools converts the instance to a copy and throws an Exception... :/
		this.options=options;
		this.options.additionalparams=this.options.additionalparams||{};
		google.maps.event.addListener(this.options.map.map, 'bounds_changed', this.loadMapData.bind(this));
	},

	decodeData: function(data, xml, req)
	{
		return {};
	},

	getMime:function()
	{
		return this.mimeType?this.mimeType:this.options.mimeType;
	},

	getBufferType:function()
	{
		return this.options.bufferType;
	}

});


ContaoMapping.DataDriver.XML=new ContaoMapping.Class({
	Implements: [Options],
	Extends: ContaoMapping.DataDriver,
	/*
	 * either raw or xml
	 */
	bufferType:'xml',
	/*
	 * Mime type this driver accepts.
	 */
	mimeType: 'text/xml',

	initialize: function(options)
	{
		this.parent(options);
		this.options.additionalparams.fmt='xml';
	},

	decodeData: function(data, xml, req)
	{
		if(!xml)
			return;
		// scan for layers
		var layers = xml.documentElement.getElementsByTagName("layer");
		var res={
			layers:[]
		};
		for (var i=0;i<layers.length;i++)
		{
			var layer={};
			layer.options = attrsFromNode(layers[i]);
			layer.markers=[];
			layer.polygons=[];
			layer.polylines=[];
			layer.code=[];
			var markerclusterer=layers[i].getElementsByTagName("markerclusterer");
			if(markerclusterer.length>0 && markerclusterer[0].firstChild)
			{
				layer.options.markerclusterer=JSON.decode(markerclusterer[0].firstChild.data);
			}
			// scan all markers
			var markers = layers[i].getElementsByTagName("marker");
			for (var j=0;j<markers.length;j++)
			{
				var m=markers[j];
				var props=attrsFromNode(m);
				var infotext=m.getElementsByTagName("infotext");
				if(infotext && infotext.firstChild)
					props.infotext=infotext.firstChild.data;
				layer.markers.push(props);
			}
			var polygons = layers[i].getElementsByTagName("polygon");
			for (var j=0;j<polygons.length;j++)
			{
				var p=polygons[j];
				var props=attrsFromNode(p);
				var points=p.getElementsByTagName("point");
				var plist=[];
				for (var l=0;l<points.length;l++) {
					plist[plist.length] = [parseFloat(points[l].getAttribute("lat")),parseFloat(points[l].getAttribute("lon"))];
					var h=points[l].getAttribute("alt");
					if(h)plist[plist.length-1].push(parseFloat(h));
				}
				props.points = plist;
				layer.polygons.push(props);
			}
			var polylines = layers[i].getElementsByTagName("polyline");
			for (var j=0;j<polylines.length;j++)
			{
				var p=polylines[j];
				var props=attrsFromNode(p);
				var points=p.getElementsByTagName("point");
				var plist=[];
				for (var l=0;l<points.length;l++) {
					plist[plist.length] = [parseFloat(points[l].getAttribute("lat")),parseFloat(points[l].getAttribute("lon"))];
					var h=points[l].getAttribute("alt");
					if(h)plist[plist.length-1].push(parseFloat(h));
				}
				props.points = plist;
				layer.polylines.push(props);
			}
			var code = layers[i].getElementsByTagName("code");
			if(code.length)
			{
				code = code[0].firstChild.data+'';
				if(code)
				{
					layer.code.push(code);
				}
			}
			res.layers.push(layer);
		}
		return res;
	},
});


ContaoMapping.registerDatadriver(ContaoMapping.DataDriver.XML);

ContaoMapping.DataDriver.JSON=new ContaoMapping.Class({
	Implements: [Options],
	Extends: ContaoMapping.DataDriver,
	/*
	 * either raw or xml
	 */
	bufferType:'raw',
	/*
	 * Mime type this driver accepts.
	 */
	mimeType: 'application/json',

	initialize: function(options)
	{
		this.parent(options);
		this.options.additionalparams.fmt='json';
	},

	decodeData: function(data, xml, req)
	{
		if(!data)
			return;
		var data = JSON.decode(data);
		// Contao 2.10 upwards has request token.
		if(data.token)
		{
			REQUEST_TOKEN = data.token;
			return data.content;
		}
		return data;
	},
});


ContaoMapping.registerDatadriver(ContaoMapping.DataDriver.JSON);



})();

(function(){
	
	
	
	
	
	
	
	
	
	

// handy prototype extension.
Function.prototype.ContaoMappingGmapImplement = function(o){for(i in o)this.prototype[i]=o[i];};


ContaoMapping.Marker = new ContaoMapping.Class({
	Implements: [Options, Events],
	map: null,
	marker:null,
	options:{},
	id: null,

	initialize: function(options)
	{
		this.setOptions(options);
		if(options.id)
			this.id=options.id;
		if(this.options.map)
			this.setMap(this.options.map);
	},
	setMap:function(map)
	{
		this.map=map;
		if(this.marker == null)
		{
	/*			shadow: new google.maps.MarkerImage('http://www.google.com/mapfiles/marker.png',
							new google.maps.Size(37, 32),
							new google.maps.Point(0,0),
							new google.maps.Point(0, 32)),
	*/			//shape: {coord: [1, 1, 1, 20, 18, 20, 18 , 1], type: 'poly'},
			var url, img, size, pos;
			if(this.options.icon)
			{
				url = this.options.icon;
				size = this.options.iconsize?this.options.iconsize.split(','):null;
				pos = this.options.iconposition?this.options.iconposition.split(','):null;
			} else {
				url = 'http://www.google.com/mapfiles/marker_yellow.png';
				//size = [20,32];
				//pos = [0,32];
			}
			if(size && pos)
			{
				img = new google.maps.MarkerImage(
							/*url*/url,
							/*size*/new google.maps.Size(size[0], size[1]),
							/*origin*/new google.maps.Point(0,0),
							/*anchor*/new google.maps.Point(pos[0], pos[1])
							/*scaledsize*/
						);
			} else {
				img = new google.maps.MarkerImage(url);
			}
			var options = {
				position : new google.maps.LatLng(this.options.latitude, this.options.longitude),
				map : null, //map.map,
				icon : img
			};
			var zindex=parseInt(this.options.zindex?this.options.zindex:map.options.zIndex);
			if(zindex)
				options.zIndex=zindex;
			this.marker = new google.maps.Marker(options);
			this.marker.contaoMarker=this;
			if(this.options.infotext)
			{
				this.createInfoBubble();
				if(this.options.autoinfo)
				{
					this.openInfoBubble();
				}
			}
		}
		return this;
	},

	createInfoBubble: function()
	{
		var infopos = this.options.infoposition?this.options.infoposition.split(','):[200,200];
		this.infoBubble = new InfoBubble({map: this.map.map,
										maxWidth: 300,
										position: new google.maps.LatLng(this.options.latitude+infopos[0], this.options.longitude+infopos[1]),
										content: this.options.infotext
										});
		this.infoBubble.setBackgroundClassName('infobubble');
		google.maps.event.addListener(this.marker, 'click', this.openInfoBubble.bind(this));
		google.maps.event.addListener(this.infoBubble, 'closeclick', this.closeInfoBubble.bind(this));
	},

	openInfoBubble: function()
	{
		if(!this.infoBubble.isOpen())
		{
			if(this.map.infobubble)
			{
				this.map.infobubble.closeInfoBubble();
			}
			this.map.savePosition();
			this.infoBubble.open();
			this.map.infobubble = this;
		}
	},

	closeInfoBubble: function()
	{
		if(this.map.infobubble==this)
		{
			this.infoBubble.close();
			this.map.revertPosition();
			this.map.infobubble = null;
		}
	},

	generateXML:function(){
		p=this.marker.getPosition();
		data=this.options;
		data.infotext=null;
		data.latitude=String(p.lat());
		data.longitude=String(p.lng());
		return xmlenc('marker', xmlencode(this.infotext), data);
	}
});

ContaoMapping.Polygon = new ContaoMapping.Class({
	Implements: [Options, Events],
	map: null,
	polygon:null,
	options:{},
	initialize: function(options)
	{
		this.setOptions(options);
		if(options.id)
			this.id=options.id;
		if(this.options.map)
			this.setMap(this.options.map);
	},
	setMap:function(map)
	{
		this.map=map;
		if(this.polygon == null)
		{
			var points = new google.maps.MVCArray();
			for(var i=0;i<this.options.points.length;i++)
			{
				points.push(new google.maps.LatLng(this.options.points[i][0], this.options.points[i][1]));
			}
			var options = {
				paths: new google.maps.MVCArray([points]),
				strokeColor: this.options.strokecolor,
				strokeOpacity: this.options.strokeopacity,
				strokeWeight: this.options.strokeweight,
				fillColor: this.options.fillcolor,
				fillOpacity: this.options.fillopacity,
				geodesic: true,
				map: map.map
			};
			var zindex=parseInt(this.options.zindex?this.options.zindex:map.options.zIndex);
			if(zindex)
				options.zIndex=zindex;
			this.polygon = new google.maps.Polygon(options);
		}
		this.show();
		return this;
	},
	hide:function()
	{
		this.polygon.setMap(null);
	},
	show:function()
	{
		if(this.map)
			this.polygon.setMap(map.map);
	}
});

ContaoMapping.PolyLine = new ContaoMapping.Class({
	Implements: [Options, Events],
	map: null,
	polyline:null,
	points:[],
	options:{},
	initialize: function(options)
	{
		this.setOptions(options);
		if(options.id)
			this.id=options.id;
		if(this.options.map)
			this.setMap(this.options.map);
		this.fireClassEvent('initialize', [this]);
	},
	setMap:function(map)
	{
		this.map=map;
		if(this.polyline == null)
		{
			var points = [];
			var len = 0;
			var altitudeDirty=false, altitudes=[];
			for(var i=0;i<this.options.points.length;i++)
			{
				var p1=this.options.points[i], p2;
				var p=new google.maps.LatLng(p1[0], p1[1]);
				if(p2)
					len+=p.distanceTo(p2);
				points.push(p);
				p2=p;
				altitudes.push(p1[2]?parseFloat(p1[2]):0);
				if(!p1[2])
					altitudeDirty=true;
			}
			if(!altitudeDirty)
				this.setAltitudes(altitudes);
			this.points=points;
			this.length=len;
			var options = {
				geodesic: true,
				path: points,
				strokeColor: this.options.strokecolor,
				strokeOpacity: this.options.strokeopacity,
				strokeWeight: this.options.strokeweight
			};
			var zindex=parseInt(this.options.zindex?this.options.zindex:map.options.zIndex);
			if(zindex)
				options.zIndex=zindex;
			this.polyline = new google.maps.Polyline(options);
		}
		this.polyline.setMap(map?map.map:null);
		this.fireClassEvent('setMap', [this]);
		return this;
	},
	hide:function()
	{
		this.polyline.setMap(null);
	},
	show:function()
	{
		this.polyline.setMap(this.map?this.map.map:null);
	},

	getAltitudes: function(callback)
	{
		if(this.options.altitudes && callback)
		{
			callback(this.options.altitudes);
			return;
		}
		if(this.map)
		{
			var points=[];
			this.polyline.getPath().forEach(function(p){points.push(p);});
			this.map.getElevation(points, (function(results){this.setAltitudes(results); if(callback)callback(results);}).bind(this));
		}
	},

	setAltitudes: function(results)
	{
		this.options.altitudes=results;
	},

	getClosestPointTo: function(latLng)
	{
		var point=0;
		var distance=8000; // keep this big
		this.points.each(function(l, i, a){var d=latLng.distanceTo(l);if(d<distance){distance=d;point=i;}});
		return {point:this.points[point], index:point};
	}

});

ContaoMapping.Layer = new ContaoMapping.Class({
	Implements: [Options, Events],
	markers: [],
	polygons: [],
	polylines: [],
	options: {},
	initialize: function(map, options) {
		this.setOptions(options);
		this.layer=new ContaoMapLayer_();
		this.map=map;
		this.id=options.id;
		this.name=options.name;

		if(options.mgrtype=='markerclusterer')
			this.createMarkerClusterer();
		 else
		 	this.createMarkerManager();
		this.hidden=false;
	},

	createMarkerManager: function()
	{
		if(typeof(MarkerManager)=='undefined')
			return ContaoMapping.dynLoad.addLib({src:sBaseHref + 'system/modules/googlemaps/html/markermanager'+(map_debug?'':'_packed')+'.js',
				callback:(function(){this.createMarkerManager();}).bind(this)});
		this.mgr = new MarkerManager(this.map.map, {trackMarkers: true});
		layer=this;
		// we have to prevent a race condition as the marker manager is lazy initialized and sends an ready event.
		google.maps.event.addListener(this.mgr, 'loaded', (function() {
			this.mgr.ready=true;
			for(var i=0;i<this.markers.length;i++)
				this.mgr.addMarker(this.markers[i].marker, 1);
		}).bind(this));
	},

	createMarkerClusterer: function()
	{
		if(typeof(MarkerClusterer)=='undefined')
			return ContaoMapping.dynLoad.addLib({src:sBaseHref + 'system/modules/googlemaps/html/markerclusterer'+(map_debug?'':'_packed')+'.js',
				callback:(function(){this.createMarkerClusterer();}).bind(this)});

		// we have to enhance the MarkerClusterer as in v1.0 it does not contain hide() and show()
		if(MarkerClusterer.prototype.hide==undefined)
		{
			MarkerClusterer.prototype.hide=function()
			{
				this.clearMarkers();
			};
		};
		if(MarkerClusterer.prototype.show==undefined)
		{
			MarkerClusterer.prototype.show=function()
			{
				m=[];this.layer.markers.each(function(e){m.push(e.marker);});
				this.addMarkers(m);
				this.redraw();
			};
		};
		if(this.options.markerclusterer)
			opts=this.options.markerclusterer;
		else
			opts={gridSize: 50, maxZoom: 12};
		this.mc = new MarkerClusterer(this.map.map, [], opts);
		this.mc.layer=this;

		for(var i=0;i<this.markers.length;i++)
			this.mc.addMarker(this.markers[i].marker);
	},

	isHidden:function(){return this.hidden;},
	visibilityChanged:function(){
		google.maps.event.trigger(this.map, 'visibilitychanged', this);
	},
	draw: function() {this.layer.draw();},
	hide:function(){
		if(this.hidden)
			return this;
		this.polygons.each(function(p){p.hide();});
		this.polylines.each(function(p){p.hide();});
		if(this.mc)
			this.mc.hide();
		else if(this.mgr)
			this.mgr.hide();
		this.hidden=true;
		this.visibilityChanged();
		return this;
	},
	show:function(){
		if(!this.hidden)
			return this;
		this.polygons.each(function(p){p.show();});
		this.polylines.each(function(p){p.show();});
		if(this.mc)
			this.mc.show();
		else if(this.mgr)
			this.mgr.show();
		this.hidden=false;
		this.visibilityChanged();
		return this;
	},
	toggle:function(){
		if(this.hidden)
			this.show();
		else
			this.hide();
		return this;
	},
	addMarker:function(marker)
	{
		marker.setMap(this.map);
		this.markers.push(marker);
		if(!this.isHidden())
		{
			if(this.mc)
				this.mc.addMarker(marker.marker);
			if(this.mgr && this.mgr.ready)
				this.mgr.addMarker(marker.marker, 1);
		}
		return this;
	},
	removeMarker:function(marker)
	{
		if(this.mc)
			this.mc.removeMarker(marker.marker);
		if(this.mgr)
			this.mgr.removeMarker(marker.marker, 1);
		arrDelete(this.markers, marker);
		marker.setMap(null);
		return this;
	},
	getMarker: function(id)
	{
		// check all markers if it has the given id.
		for(var i=0;i<this.markers.length;i++)
		{
			if(this.markers[i].id==id)
			{
				return this.markers[i];
			}
		}
		return null;
	},
	addPolygon:function(polygon){
		this.polygons.push(polygon);
		if(!this.isHidden())
			polygon.setMap(this.map);
		return this;
	},
	removePolygon:function(polygon){
		if(arrDelete(this.polygons,polygon))
		{
			if(!this.isHidden())
				polygon.setMap(null);
		}
		return this;
	},
	getPolygon: function(id)
	{
		// check all polygons if it has the given id.
		for(var i=0;i<this.polygons.length;i++)
		{
			if(this.polygons[i].id==id)
			{
				return this.polygons[i];
			}
		}
		return null;
	},
	addPolyline:function(polyline){
		this.polylines.push(polyline);
		if(!this.isHidden())
			polyline.setMap(this.map);
		return this;
	},
	removePolyline:function(polyline){
		if(arrDelete(this.polylines,polyline))
		{
			if(!this.isHidden())
				polyline.setMap(null);
		}
		return this;
	},
	getPolyline: function(id)
	{
		// check all polylines if it has the given id.
		for(var i=0;i<this.polylines.length;i++)
		{
			if(this.polylines[i].id==id)
			{
				return this.polylines[i];
			}
		}
		return null;
	},
	getIds:function()
	{
		var res={'markers':[],'polygons':[],'polylines':[]};
		for(var i=0;i<this.markers.length;i++)
			res.markers.push(this.markers[i].id);
		for(var i=0;i<this.polygons.length;i++)
			res.polygons.push(this.polygons[i].id);
		for(var i=0;i<this.polylines.length;i++)
			res.polylines.push(this.polylines[i].id);
		return res;
	}
});

ContaoMapping.Map = new ContaoMapping.Class({
	Implements: [Options, Events],
	container:null,
	map:null,
	driver:null,
	controls:[],
	layers:[],
	markers:[],
	polygons:[],
	polylines:[],
	scripts:{},
	options:{},
/*
	icons:{
		normal: google.maps.DEFAULT_ICON,
		high:'http://www.google.com/mapfiles/marker_yellow.png',
		dragging:'http://www.google.com/mapfiles/dir_60.png',
	},
*/
	options: {
	  zoom: 8,
	  disableDefaultUI: true,
	  view: null,
	  center:null,
	  markerClass: ContaoMapping.Marker,
	  polygonClass: ContaoMapping.Polygon,
	  polylineClass: ContaoMapping.PolyLine,
	  zIndex: 5
	},
	initialize: function(container, options)
	{
		this.lookupViews={
			'normalmap':google.maps.MapTypeId.ROADMAP,
			'satellitemap':google.maps.MapTypeId.SATELLITE,
			'hybridmap':google.maps.MapTypeId.HYBRID,
			'physicalmap':google.maps.MapTypeId.TERRAIN
		};
		this.lookupControls={
			'normal': google.maps.MapTypeControlStyle.DEFAULT, 
			'menu': google.maps.MapTypeControlStyle.DROPDOWN_MENU, 
			'hierarchical': google.maps.MapTypeControlStyle.HORIZONTAL_BAR
		};
		this.lookupZoom={
			'android': google.maps.NavigationControlStyle.ANDROID,
			'small': google.maps.NavigationControlStyle.SMALL,
			'large': google.maps.NavigationControlStyle.ZOOM_PAN
		};
		this.container = container;
		if(options.center.length == 1)
			options.center=options.center[0].split(',');
		this.setOptions(options);
		this.id=this.options.id;
		ContaoMapping.Map.instances.push(this);
		if((typeof(google.maps.Polyline.prototype.getBounds) != 'undefined'))
			this.boot();
	},
	boot: function()
	{
		// already booted?
		if(this.map)
			return;
		this.createMap();
	},
	/* altered version of the contao loader, copied from TL BE framework (c) Leo Feyer */
	displayBox: function(e)
	{
		return;
		var d=document.id("map_ajaxBox");
		if(!d)d = new Element("div").setProperty("id", "map_ajaxBox").injectInside(this.container);
		if(Browser.Engine.trident&&Browser.Engine.version<5)
		{var f=$$("select");for (var c=0;c<f.length;c++){f[c].setStyle("visibility", "hidden");};}
		d.set("html",e);
		d.setStyle("display","block");
	},
	hideBox: function()
	{
		return;
		var c=document.id("map_ajaxBox");
		if(c){
			c.setStyle("display","none");
			if(Browser.Engine.trident&&Browser.Engine.version<5)
			{var d=$$("select");for(var b=0;b<d.length;b++){d[b].setStyle("visibility", "visible");}}
		}
	},
	/* END: copied from TL BE framework (c) Leo Feyer */

	createMap: function()
	{
		this.options.mapTypeId = this.lookupViews[this.options.view] ? this.lookupViews[this.options.view] : google.maps.MapTypeId.ROADMAP;
		this.options.center=((typeof(this.options.center)=='string')?this.options.center.split(','):this.options.center);
		var foo=this.options.center.constructor.toString().indexOf("Array");
		if((this.options.center.constructor.toString().indexOf("Array") == -1) || !(this.options.center.length==2))
		{
			alert('Improper center given.');
		}
		this.options.center = new google.maps.LatLng(this.options.center[0], this.options.center[1]);
		this.options.zoom = 1*this.options.zoom;
		this.options.mapTypeControlOptions = {mapTypeIds:[]};
		for(var p in this.lookupViews)
		{
			if(in_array(p, this.options.aviews))
			{
				this.options.mapTypeControlOptions.mapTypeIds.push(this.lookupViews[p]);
			}
		}
		this.options.mapTypeControl = (this.options.viewcontrol != undefined);
		if(this.options.mapTypeControl)
		{
			this.options.mapTypeControlOptions.style = google.maps.MapTypeControlStyle.DEFAULT;
			for(var p in this.lookupControls)
			{
				if(p==this.options.viewcontrol)
				{
					this.options.mapTypeControlOptions.style=this.lookupControls[p];
					break;
				}
			}
		}
		if(this.options.zoomcontrol!=undefined){
			this.options.navigationControl= true;
			for(var p in this.lookupZoom){if(p==this.options.zoomcontrol){this.options.navigationControlOptions ={style:this.lookupZoom[p]};break;}}
		}
		// now create the real map
		if(typeof(this.container)=='string')this.container=$$("#"+this.container)[0];
		this.map = new google.maps.Map(this.container, this.options);
		if(this.options.centerOnUser)
		{
			this.getGeolocation(this.setCenter.bind(this), function(){alert('I can not determine where you are... I apologize.');});
		}
		if(this.options.layerswitch)
		{
			map=this;
			var createSwitch = function()
			{
				map.controls.push(new LayerSwitcherMapControl(map));
			};
			if(typeof(LayerSwitcherMapControl)=='undefined')
				ContaoMapping.dynLoad.addLib(true, {src:sBaseHref +'system/modules/googlemaps/html/layerswitch.js', callback: createSwitch});
			else
				createSwitch();
		}
		this.fireClassEvent('createMap', [this]);
//		var drvclass=ContaoMapping.getDataDriver('text/xml');
		var drvclass=ContaoMapping.getDataDriver('application/json');
		var me=this;
		this.driver= new drvclass({map:me, url:this.options.url, additionalparams: this.options.additionalparams});
	},
	getGeolocation:function(handleGeolocation, handleNoGeolocation)
	{
		// Try W3C Geolocation (Preferred)
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(
				function(position) {
					if(handleGeolocation)handleGeolocation(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
				}, function() {
					if(handleNoGeolocation)handleNoGeolocation(true);
				});
			return;
		}
		// Try Google Gears Geolocation
		if(google.gears)
		{
			var geo = google.gears.factory.create('beta.geolocation');
			geo.getCurrentPosition(function(position)
			{
				if(handleGeolocation)handleGeolocation(new google.maps.LatLng(position.latitude,position.longitude));
			}, function()
			{
				if(handleNoGeolocation)
					handleNoGeoLocation(true);
			});
			return;
		}
		// Browser doesn't support Geolocation
		if(handleNoGeolocation)
			handleNoGeolocation(false);
	},
	assembleKnownIds:function()
	{
		// TODO: cache this.
		var ids={};
		for(var i=0;i<this.layers.length;i++)
			ids[this.layers[i].id]=this.layers[i].getIds();
		return ids;
	},

	getExtendedBoundsAsUrl: function()
	{
		var bounds=this.map.getBounds();

		var test=bounds.toUrlValue();

		return bounds.extendBoundsByRatio(.5).toUrlValue();
	},

	getId: function()
	{
		var n=Math.floor(Math.random()*11)+65;
		var k = Math.floor(Math.random()* 1000000);
		return String.fromCharCode(n)+k;
	},
	killscript: function(id)
	{
		var script = this.scripts[id];
		document.id(script).destroy();
		delete(this.scripts[id]);
	},
	runcode: function(code)
	{
		var id = this.getId();
		code = '(function(){'+code+'; this.killscript("'+id+'");}).bind('+this.options.id+').run();';
		var e = document.createElement("script");e.type="text/javascript";
		/* IE does not allow <script> to have children. :( */
		if (null == e.canHaveChildren || e.canHaveChildren){e.appendChild(document.createTextNode(code));} 
		else {e.text = code;}
		this.scripts[id]=e;
		document.getElementsByTagName("head")[0].appendChild(e);
	},
	handleMapData:function(data)
	{
		if(!data)
			return;
		// scan for layers
		for (var i=0;i<data.layers.length;i++)
		{
			var props = data.layers[i].options;
			layer=this.getLayer(props.id, true, props);
			// scan all markers
			var markers = data.layers[i].markers;
			if(markers)for (var j=0;j<markers.length;j++)
			{
				var props=markers[j];
				props.layer=layer.id;
				if(layer.getMarker(props.id))
					continue;
				layer.addMarker(new this.options.markerClass(props));
			}
			// scan all polygons
			var polygons = data.layers[i].polygons;
			if(polygons)for (var j=0;j<polygons.length;j++)
			{
				var props=polygons[j];
				props.layer=layer.id;
				if(layer.getPolygon(props.id))
					continue;
				layer.addPolygon(new this.options.polygonClass(props));
			}
			var polylines = data.layers[i].polylines;
			if(polylines)for (var j=0;j<polylines.length;j++)
			{
				var props=polylines[j];
				props.layer=layer.id;
				if(layer.getPolyline(props.id))
					continue;
				layer.addPolyline(new this.options.polylineClass(props));
			}
			var codes = data.layers[i].code;
			if(codes)for (var j=0;j<codes.length;j++)
			{
				var code = codes[j];
				if(code)
				{
					this.runcode(code);
				}
			}
		}
		return this;
	},

	savePosition: function()
	{
		this.position = this.map.getCenter();
	},

	revertPosition: function()
	{
		if(this.position)
			this.panTo(this.position);
		this.position = null;
	},

	setCenter: function(location)
	{
		if((location.constructor.toString().indexOf("Array") > -1) && (location.length==2))
		{
			location = new google.maps.LatLng(location[0], location[1]);
		}
		this.map.setCenter(location);
		return this;
	},

	getCenter: function()
	{
		return this.map.getCenter();
	},

	panTo: function(location)
	{
		this.map.panTo(location);
		return this;
	},

	getLayer:function(id, create, props)
	{
		for(i=0;i<this.layers.length;i++)
		{
			if(this.layers[i].id==id)
				return this.layers[i];
		}
		if(create)
		{
			if(!props)
				props={};
			props.id=id;
			layer=new ContaoMapping.Layer(this, props);
			this.layers.push(layer);
			google.maps.event.trigger(this, 'layeradded', layer);
			return layer;
		}
		return null;
	},

	getElevation: function(points, callback)
	{
		if(!this.elevator)
			this.elevator = new google.maps.ElevationService();
		var getPoints=function(min,amount){return points.filter(function(e,i){return (i>=min)&&(i<min+amount);});
		};
		var chunksize=300;
		var ele=[];
		var index=0;
		var map=this;
		var cb=null;
		while(ele.length<points.length)ele.push(0);
		var fetchNext=(function()
		{
			var mypoints;
			var cb=null;
			// if we have more than -chunksize- points, we hit the limit.... chunk them if so.
			if(points.length>chunksize)
			{
				mypoints=getPoints(index,chunksize);
				cb=(points.length>index+chunksize)?fetchNext:callback;
			} else {
				mypoints=points;
				cb=callback;
			}
			var positionalRequest = {'locations': mypoints};
			map.elevator.getElevationForLocations(positionalRequest, function(results, status)
			{
				if (status == google.maps.ElevationStatus.OK)
				{
					results.each(function(e, i){ele[index+i]=e.elevation;});
				} else {
					ContaoMapping.debug(positionalRequest);
					ContaoMapping.debug(status);
				}
				index+=chunksize;
				// sleep some time to give google a rest.
				if(cb==fetchNext)
					(function(){cb(ele);}).delay(1500);
				else
					cb(ele);
			});
		}).bind(fetchNext);
		fetchNext();
	},

	// DEFUNC as of reimplementation of layer manager.
	addMarkerFromQuery:function(query, title, callback)
	{
		var mymap=this;
		coder = new google.maps.Geocoder();
		data = coder.geocode({address:query}, function(results, status)
			{
				if (status == google.maps.GeocoderStatus.OK)
				{
					data = results[0];
					if(title)
						title += ' ';
					for(i=0;i<data.address_components.length;i++)
					{
						if(data.address_components[i].types=='locality,political'){title+=data.address_components[i].long_name;}
					}
					marker = mymap.addMarker(new mymap.options.markerClass({
										infotext:title, 
										latitude: data.geometry.location.lat(), 
										longitude: data.geometry.location.lng()}));
				}
				else
					alert('ERROR '+status);
				if(callback)callback(mymap, status, data, marker);
			});
		return this;
	}
});
ContaoMapping.Map.instances=[];

//ContaoMapping.Map.addClassEvent('createMap', function(){ContaoMapping.debug(arguments); });


ContaoMapping.MapZoomMapControl=function(map)
{
	this.map = map;
	this.control=Element('div', {'class':"mapfullscreen_control"});
	this.maximized=false;
	this.keeper=Element('div');
	var toggler=Element('a', {'class':'mapfullscreen_toggler'});
	this.control.appendChild(toggler);
	toggler.addEvent('click', (function() {
		if(this.maximized)
		{
			copyStyle(this.keeper, this.map.container);
			toggler.removeClass('active');
			this.map.container.style.setProperty('z-index', 0, null);
			this.maximized=false;
		} else {
			copyStyle(this.map.container, this.keeper);
			var s=this.map.container.style;
			var clientsize = window.getSize();
			s.setProperty('position', 'fixed', null);
			s.setProperty('top', '0', null);
			s.setProperty('left', '0', null);
			s.setProperty('width', clientsize.x+'px', null);
			s.setProperty('height', clientsize.y+'px', null);
			s.setProperty('z-index', 10, null);
			toggler.addClass('active');
			this.maximized=true;
		}
		var center=this.map.getCenter();
		google.maps.event.trigger(map.map, 'resize');
		this.map.setCenter(center);
	}).bind(this));
	map.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.control);
};

ContaoMapping.Map.addClassEvent('createMap', ContaoMapping.MapZoomMapControl);

HoverWindow.prototype = new google.maps.OverlayView();
function HoverWindow(latLng, map)
{
	// Now initialize all properties.
	this.latLng_ = latLng;
	this.map_ = null;
	this.div_ = null;
	this.text_='';
	this.setMap(map);
}

HoverWindow.ContaoMappingGmapImplement({
	onAdd: function()
	{
		var div = document.createElement('DIV');
		div.style.border = "none";
		div.style.borderWidth = "0px";
		div.style.position = "absolute";
		// Set the overlay's div_ property to this DIV
		this.div_ = div;
		// We add an overlay to a map via one of the map's panes.
		// We'll add this overlay to the overlayImage pane.
		var panes = this.getPanes();
		panes.overlayImage.appendChild(this.div_);
		this.setText(this.text_);
	},
	draw: function()
	{
		var overlayProjection = this.getProjection();
		// Retrieve the southwest and northeast coordinates of this overlay
		// in latlngs and convert them to pixels coordinates.
		// We'll use these coordinates to resize the DIV.
		var tl = overlayProjection.fromLatLngToDivPixel(this.latLng_);
	
		// Resize the image's DIV to fit the indicated dimensions.
		var div = this.div_;
		div.style.left = (tl.x+50) + 'px';
		div.style.top = tl.y + 'px';
		div.style.width = 300 + 'px';
		div.style.height = 300 + 'px';
		div.style.backgroundColor ='#000000';
	},
	setPosition: function(latLng)
	{
		this.latLng_=latLng;
		if(this.div_)
			this.draw();
	},
	setText: function(text, latLng)
	{
		this.text_=text;
		if(this.div_)
		{
			this.div_.set('html', text);
			if(latLng)
				this.setPosition(latLng);
		}
	},
	onRemove: function()
	{
		this.div_.parentNode.removeChild(this.div_);
	},
	hide: function() {
		if (this.div_) {
			this.div_.style.visibility = "hidden";
		}
	},	
	show: function() {
		if (this.div_) {
			this.div_.style.visibility = "visible";
		}
	},	
	toggle: function() {
		if (this.div_) {
			if (this.div_.style.visibility == "hidden") {
				this.show();
			} else {
				this.hide();
			}
		}
	},	
	toggleDOM: function() {
		if (this.getMap()) {
			this.setMap(null);
		} else {
			this.setMap(this.map_);
		}
	}
});

ContaoMapping.PolyLine.addClassEvent('setMap',
	function(p){
		ContaoMapping.dynLoad.addLib({
			src:[
				sBaseHref + 'system/modules/googlemaps/html/gra.js',
				sBaseHref + 'system/modules/googlemaps/html/plot.js'],
			callback:function(){
				PolyLineHeightMap.AttachPolyline(p);
			}
		});
	}
);

PolyLineHeightMap.prototype = new google.maps.OverlayView();
function PolyLineHeightMap(polyline)
{
	// Now initialize all properties.
	this.size={x:200,y:150};
	this.latLng_ = null;
	this.div_ = null;
	this.cross_ = null;
	this.text_='';
	this.setPolyLine(polyline);
	this.setMap(polyline.map.map);
	//this.hide();
}
PolyLineHeightMap.AttachPolyline= function(p) {
		if(!p.PolyLineHeightMap)
			new PolyLineHeightMap(p);
};

PolyLineHeightMap.ContaoMappingGmapImplement({
	setPolyLine: function(polyline)
	{
		this.polyline=polyline;
		this.polyline.PolyLineHeightMap=this;
		google.maps.event.addListener(this.polyline.polyline, 'mouseover', (this.hovered).bind(polyline));
		google.maps.event.addListener(this.polyline.polyline, 'mouseout', (this.unhovered).bind(polyline));
		google.maps.event.addListener(this.polyline.polyline, 'mousemove', (this.mousemove).bind(polyline));
		google.maps.event.addListener(this.polyline.polyline, 'click', (this.mouseclick).bind(polyline));
	},

// BEGIN FIRED FROM CONTEXT ContaoMapping.Polyline
	hovered: function(e)
	{
		if(!this.map.polyLineHeightmap)
		{
			this.PolyLineHeightMap.setPosition(e.latLng);
			this.PolyLineHeightMap.show();
		}
	},
	unhovered: function(e)
	{
		if(!this.map.polyLineHeightmap)
		{
			this.PolyLineHeightMap.hide();
		}
	},
	mousemove:function(e)
	{
		if(this.map.polyLineHeightmap==this.PolyLineHeightMap)
		{
			this.PolyLineHeightMap.setPosition(e.latLng);
		}
	},
	mouseclick:function(e)
	{
		this.PolyLineHeightMap.setPosition(e.latLng);
		this.PolyLineHeightMap.show(true);
	},
// END FIRED FROM CONTEXT ContaoMapping.Polyline

// BEGIN FIRED FROM plot
	plotOver: function(x, y)
	{
		
	},

	plotOut: function(x, y)
	{
		
	},

	plotMove: function(x, y)
	{
		this.polyline.map.panTo(this.polyline.points[x]);
		this.setPosition(this.polyline.points[x]);
	},

// END FIRED FROM plot

	onAdd: function()
	{
		var div = document.createElement('DIV');
		div.addClass('polylineheightmap');
		div.style.height = this.size.y + 'px';
		div.id=this.polyline.map.id+'_polyline_'+this.polyline.id+'_heightmap';

		var divclose=document.createElement('A');
		divclose.addClass('closebtn');
		divclose.addEvent('click', this.hide.bind(this));
		div.appendChild(divclose);

		// Set the overlay's div_ property to this DIV
		this.div_ = div;
		this.cross_ = document.createElement('div');
		this.cross_.addClass('polylineheightmap_cross');
		
		this.getPanes().floatPane.appendChild(this.cross_);
		this.polyline.map.container.getParent().appendChild(this.div_);
		this.hide();
	},

	drawPlot:function(heights)
	{
		if(!this.plot)
		{
			this.plot=new plot(this.div_.id,'t','h');
			this.plot.PolyLineHeightMap=this;
		}
		var data=[];
		var polyline=this.polyline;
		var p=this.plot;
		var p1=this.polyline.points[0];
		var dist=0;
		this.polyline.points.each(function(p,i){
			dist += p1.distanceTo(p);
			p1=p;
			data.push({'lat':p.lat(), 'lng':p.lng(), 'h':heights[i], 't':dist});
			});
		this.plotdata=data;
		p.clear();
		p.scale(data);
		p.frame(50,35,'km (total: '+this.polyline.length.toPrecision(10).toString(10)+'km)','h<br/>in<br/>m');
		p.plot(data, this.polyline.options.strokecolor);
		p.showmarker('');
		p.markeron(this.plotdata, this.plotOver.bind(this), this.plotOut.bind(this),this.plotMove.bind(this));
	},

	draw: function()
	{
		if(!this.latLng_)
			return;
		var overlayProjection = this.getProjection();
		// Retrieve the southwest and northeast coordinates of this overlay
		// in latlngs and convert them to pixels coordinates.
		// We'll use these coordinates to resize the DIV.
		var tl = overlayProjection.fromLatLngToDivPixel(this.latLng_);
		// Resize the image's DIV to fit the indicated dimensions.
		var div = this.div_;
		//div.style.left = (tl.x+20) + 'px';
		//div.style.top = tl.y + 'px';
		if(this.plot)
		{
			var point=this.polyline.getClosestPointTo(this.latLng_);
			this.plot.setmarker(this.plotdata[point.index]);
		}

		var p=this.getProjection().fromLatLngToDivPixel(this.latLng_);
		this.cross_.style.top=(p.y-8)+'px';
		this.cross_.style.left=(p.x-8)+'px';
	},
	setPosition: function(latLng)
	{
		this.latLng_=latLng;
		if(this.div_)
			this.draw();
	},
	onRemove: function()
	{
		this.div_.parentNode.removeChild(this.div_);
	},
	hide: function() {
		if (this.div_) {
			this.div_.style.display = "none";
			this.cross_.style.display = "none";
		}
		this.polyline.polyline.setOptions({strokeColor: this.polyline.options.strokecolor});
		if(this.polyline.map.polyLineHeightmap==this)
		{
			this.polyline.map.polyLineHeightmap=null;
		}
	},	
	show: function(persistent) {
		if (this.div_) {
			this.div_.style.display = "block";
			this.cross_.style.display = "block";
			this.polyline.getAltitudes(this.drawPlot.bind(this));
		}
		this.polyline.polyline.setOptions({strokeColor:'#ff0000'});
		if(persistent)
		{
			if(this.polyline.map.polyLineHeightmap==this)
				return;
			if(this.polyline.map.polyLineHeightmap)
				this.polyline.map.polyLineHeightmap.hide();
			this.polyline.map.polyLineHeightmap=this;
		}
	},	
	toggle: function() {
		if (this.div_) {
			if (this.div_.style.display == "none") {
				this.show();
			} else {
				this.hide();
			}
		}
	}
});


ContaoMapping.dynLoad.addLib({src:sBaseHref +'system/modules/googlemaps/html/gmaphelpers.js'});
ContaoMapping.dynLoad.addLib({src:sBaseHref +'system/modules/googlemaps/html/infobubble'+(map_debug?'':'-compiled')+'.js'});
// keep this last!! it boots the maps
ContaoMapping.dynLoad.addLib({code:'ContaoMapping.bootMaps();'});
//ContaoMapping.dynLoad.addLib();


window.addEvent("domready", ContaoMapping.dynLoad.loadNext);
})();
