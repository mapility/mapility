document.write('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>');

var map_debug=true;
var sBaseHref = document.getElementsByTagName("base")[0].getAttribute("href");
var maplibs= [
sBaseHref + 'system/modules/contaomaps_google/js/markermanager'+(map_debug?'':'_packed')+'.js',
];

function loadnext()
{
	if(maplibs.length==0)
	{
		libsBooted=true;
		return;
	}
	var e = document.createElement("script");
	e.type="text/javascript";
	var s=maplibs.shift();
	if(maplibs.length==1)
		libsBooted=true;
	if(s.test(/^http:/))
	{
		if (e.onreadystatechange === undefined)
			// Gecko & Opera
			e.onload=loadnext;
		else
			// IE
			e.onreadystatechange= function(){if ((this.readyState == 'loaded') || (this.readyState == 'complete')){this.onreadystatechange=null; loadnext();}};
		e.src = s;
	} else {
		/* IE does not allow <script> to have children. :( */
		if (null == e.canHaveChildren || e.canHaveChildren) {
			e.appendChild(document.createTextNode(s));
		} else {
			e.text = s;
		}
		if(maplibs.length)
			loadnext();
	}
	document.getElementsByTagName("head")[0].appendChild(e);
}

// wait for google api to come available...
function waitForGoogle()
{
	if(typeof(google)=='undefined')
	{
		setTimeout('waitForGoogle();', 100);
	} else {
		loadnext();
	}
}
window.addEvent("domready", function(){waitForGoogle();});




// workaround to make the script work in the frontend.
if(typeof(ContaoMaps) == 'undefined')
	ContaoMaps={};

ContaoMaps.pickGeoLocation=function(img, c, options)
{
	if($(img).googlemap)
	{
		$(img).googlemap.close();
		$(img).googlemap=null;
	} else {
		currentId = c;
		coord=$(c).value.split(',');
		if(coord.length!=2) // center of Germany, shall we change this somehow?
			coord=[50.9216490, 10.3591188];
		options.inputid=c;
		options.center=new google.maps.LatLng(coord[0], coord[1]);
		$(img).googlemap = new backendGoogleMap($(img).getParent(), options);
		$(img).googlemap.markerEdit();
	}
};

ContaoMaps.generatePolygon = function(img, c, id, table)
{
	if($(img).googlemap)
	{
		$(img).googlemap.close();
		$(img).googlemap=null;
	} else {
		currentId = c;
		coord=$(c).value.split(',');
		if(coord.length!=2) // center of Germany, shall we change this somehow?
			coord=[50.9216490, 10.3591188];
		center=new google.maps.LatLng(coord[0], coord[1]);
		var parent = $(img).getParent();
		if(parent.tagName!='div')
			parent = $(parent).getParent();
		$(img).googlemap = new backendGoogleMap(parent, {inputid:c,center:center});
		$(img).googlemap.polygonEdit();
	}
};

ContaoMaps.generatePolyline = function(img, c, id, table)
{
	if($(img).googlemap)
	{
		$(img).googlemap.close();
		$(img).googlemap=null;
	} else {
		currentId = c;
		coord=$(c).value.split(',');
		if(coord.length!=2) // center of Germany, shall we change this somehow?
			coord=[50.9216490, 10.3591188];
		center=new google.maps.LatLng(coord[0], coord[1]);
		var parent = $(img).getParent();
		if(parent.tagName!='div')
			parent = $(parent).getParent();
		// form tag has id of table name.
		$(img).googlemap = new backendGoogleMap(parent, {inputid:c,center:center});
		$(img).googlemap.polylineEdit();
	}
};

var googleMapPolyEditor = new Class({
	Implements: [Options, Events],
	options:{},
	markers: [],
	getBounds: null,
	path: null,
	poly: null,
	minZoomLevel: 14,
	maxZoomLevel: 19,
	initialize: function(map, options)
	{
		this.path = new google.maps.MVCArray;
		this.map = map;
		this.setOptions(options);
		if(!this.options.markerimage)
			this.options.markerimage=new google.maps.MarkerImage(
				sBaseHref+'system/modules/googlemaps/html/lineedit0.png',
				/*size*/new google.maps.Size(16, 16),
				/*origin*/new google.maps.Point(0,0),
				/*anchor*/new google.maps.Point(8, 8)
				/*scaledsize*/
			);
		if(!this.options.lineimage)
			this.options.lineimage=new google.maps.MarkerImage(
				sBaseHref+'system/modules/googlemaps/html/lineedit1.png',
				/*size*/new google.maps.Size(16, 16),
				/*origin*/new google.maps.Point(0,0),
				/*anchor*/new google.maps.Point(8, 8)
				/*scaledsize*/
			);
		this.mgr = new MarkerManager(this.map.map, {trackMarkers: true});
		// we have to prevent a race condition as the marker manager is lazy initialized and sends an ready event.
		google.maps.event.addListener(this.mgr, 'loaded', (function() {
			this.mgr.ready=true;
			this.mgr.addMarkers(this.markers, this.minZoomLevel, this.maxZoomLevel);
			var lm=[];
			this.markers.each(function(m){
				if(m.linemarker)
				{
					lm.push(m.linemarker);
				}
			});
			this.mgr.addMarkers(lm, this.minZoomLevel, this.maxZoomLevel);
		}).bind(this));
	},

	close:function()
	{
		this.getElevations(this.syncMarkerControl.bind(this));
	},

	syncMarkerControl: function()
	{
		var strMarkers='';
		for(var i=0;i<this.markers.length;i++)
		{
			var marker=this.markers[i];
			strMarkers += marker.getPosition().toUrlValue()+','+marker.altitude+"\n";
		}
		$(this.map.options.inputid).value=strMarkers;
	},

	getElevations: function(callback)
	{
		if(!this.elevator)
			this.elevator = new google.maps.ElevationService();
		var points=[];
		this.markers.each(function(m){if(!m.altitude)points.push(m.getPosition());});
		var getPoints=function(min,amount){
			return points.filter(function(e,i){return((i>=min)&&(i<min+amount));});
		};
		var chunksize=300;
		var index=0;
		var me=this;
		var cb=null;
		var fetchNext=(function()
		{
			var mypoints;
			var cb=null;
			if(points.length==0)
				callback();
			// if we have more than -chunksize- points, we hit the limit.... chunk them if so.
			if(points.length>chunksize)
			{
				mypoints=getPoints(index,chunksize);
				index+=chunksize;
				cb=(points.length>index)?fetchNext:callback;
			} else {
				mypoints=points;
				cb=callback;
			}
			var positionalRequest = {'locations': mypoints};
			me.elevator.getElevationForLocations(positionalRequest, function(results, status)
			{
				if (status == google.maps.ElevationStatus.OK)
				{
					results.each((function(e, i)
					{
						//var ep=e.location;
						var ep=mypoints[i];
						this.markers.each(function(m)
						{
							var p=m.getPosition();
							var dx=Math.abs(p.lat()-ep.lat());
							var dy=Math.abs(p.lng()-ep.lng());
							if((!m.altitude) && (dx==0) && (dy==0))
								m.altitude=e.elevation;
						});
					}).bind(me));
				} else {
					ContaoMapping.debug(positionalRequest);
					ContaoMapping.debug(status);
				}
				// sleep some time to give google a rest.
				if(cb==fetchNext)
					(function(){cb();}).delay(150);
				else
					cb();
			});
		}).bind(fetchNext);
		fetchNext();
	},

	calcCenter: function(l1,l2)
	{
		return new google.maps.LatLng((l1.lat()+l2.lat())/2, (l1.lng()+l2.lng())/2);
	},

	setEvents: function(marker)
	{
		marker.listenDragStart=google.maps.event.addListener(marker, 'dragstart', (function(){this.editor.markerDragStart(this);}).bind(marker));
		marker.listenDrag=google.maps.event.addListener(marker, 'drag', (function(){this.editor.markerDrag(this);}).bind(marker));
		marker.listenDragEnd=google.maps.event.addListener(marker, 'dragend', (function(){this.editor.markerDragEnd(this);}).bind(marker));
		marker.listenClick=google.maps.event.addListener(marker, 'click', (function(){this.editor.markerRemove(this);}).bind(marker));
	},

	getLineMarkerFor: function(marker)
	{
		if(!marker.right)
			return;
		var isNew=(!marker.linemarker)&&true;
		marker.linemarker = (!isNew)?marker.linemarker:new google.maps.Marker({
			position: this.calcCenter(marker.getPosition(),
			marker.right.getPosition()),
			draggable: true,
			icon: this.options.lineimage,
			flat:true
		});
		marker.linemarker.host=marker;
		marker.linemarker.altitude=0;
		marker.linemarker.editor=this;
		if(isNew)
		{
			this.setEvents(marker.linemarker);
			if(this.mgr.ready)
				this.mgr.addMarker(marker.linemarker, this.minZoomLevel, this.maxZoomLevel);
		}
		marker.linemarker.isline = true;
	},

	dropLineMarkerFor: function(marker)
	{
		if(marker.linemarker)
		{
			if(this.mgr.ready)
				this.mgr.removeMarker(marker.linemarker);
			marker.linemarker.setMap(null);
			marker.linemarker.host=null;
			marker.linemarker.editor=null;
		}
		marker.linemarker=null;
	},

	addPoint: function(latLng, altitude)
	{
		var marker=new google.maps.Marker({
			position: latLng,
			draggable: true,
			icon: this.options.markerimage,
			flat:true
		});
		var left=(this.markers.length>0)?this.markers.getLast():null;
		marker.editor = this;
		marker.isline = false;
		marker.left = left;
		marker.right = null;
		marker.altitude = altitude?altitude:0;
		if(left)
		{
			left.right=marker;
			this.getLineMarkerFor(left);
		}
		if(this.mgr.ready)
			this.mgr.addMarker(marker, this.minZoomLevel, this.maxZoomLevel);
		this.markers.push(marker);
		this.path.push(latLng);
		this.setEvents(marker);
		return marker;
	 },

	markerRemove: function(marker)
	{
		if(marker.isline)
			return;
		var i=this.markers.indexOf(marker);
		this.markers.splice(i, 1);
		this.path.removeAt(i);
		if(this.mgr.ready)
			this.mgr.removeMarker(marker);
		marker.setMap(null);
		marker.editor=null;
		this.dropLineMarkerFor(marker);
		marker.left.right=marker.right;
		if(marker.right)
		{
			marker.right.left=marker.left;
		} else {
			// nothing right hand, drop the line marker of left hand.
			this.dropLineMarkerFor(marker.left);
		}
		this.markerDrag(marker.left);
		this.markerDrag(marker.right);
		marker.left=null;
		marker.right=null;
		if(marker.listenDragStart)
			google.maps.event.removeListener(marker.listenDragStart);
		if(marker.listenDrag)
			google.maps.event.removeListener(marker.listenDrag);
		if(marker.listenDragEnd)
			google.maps.event.removeListener(marker.listenDragEnd);
		if(marker.listenClick)
			google.maps.event.removeListener(marker.listenClick);
		this.syncMarkerControl();
	},

	convertLineMarkerToMarker: function(marker)
	{
		var host = marker.host;
		marker.host = null;
		var idx=this.markers.indexOf(host);
		this.path.insertAt(idx+1, marker.getPosition());
		var tmp=this.markers;
		this.markers=[];
		tmp.each(function(e,i){
			this.push(e);
			if(i==idx)
				this.push(marker);
			e.setTitle(String(i));
		}, this.markers);
		marker.setIcon(this.options.markerimage);
		marker.left=host;
		marker.right=host.right;
		marker.right.left=marker;
		marker.left.right=marker;
		this.getLineMarkerFor(marker);
		marker.left.linemarker=null;
		this.getLineMarkerFor(marker.left);
		marker.isline=false;
	},

	markerDragStart: function(marker)
	{
		if(marker.isline)
		{
			this.convertLineMarkerToMarker(marker);
		}
	},

	markerDrag:function(marker)
	{
		if(!marker)
			return;
		if(!marker.isline)
		{
			var p=marker.getPosition();
			var i=this.markers.indexOf(marker);
			this.path.setAt(i, p);
		}
		if(marker.right)
			marker.linemarker.setPosition(this.calcCenter(p, marker.right.getPosition()));
		if(marker.left)
			marker.left.linemarker.setPosition(this.calcCenter(marker.left.getPosition(), p));
	},

	markerDragEnd: function(marker)
	{
		marker.altitude=0;
	},

	addTriangle: function(event)
	{
		var latLng = event.latLng;
		if(this.markers.length>0)
			return;
		var ne=this.map.map.getBounds().getNorthEast(), sw=this.map.map.getBounds().getSouthWest();
		var d1 = parseFloat((ne.lng() - sw.lng())/8);
		var d2 = parseFloat((ne.lat() - sw.lat())/8);
		this.addPoint(latLng);
		this.addPoint(new google.maps.LatLng(parseFloat(latLng.lat()-d1), parseFloat(latLng.lng()-d2)));
		this.addPoint(new google.maps.LatLng(parseFloat(latLng.lat()-d1), parseFloat(latLng.lng()+d2)));
		this.getLineMarkerFor(this.markers[0]);
		this.markers.each(this.markerDrag.bind(this));
	},

});

var googleMapPolyLineEditor = new Class({
	Extends: googleMapPolyEditor,
	initialize: function(map, options)
	{
		this.setOptions(options);
		if(!google.maps.Polyline.prototype.getBounds)
			google.maps.Polyline.prototype.getBounds = function(){
				var bounds=new google.maps.LatLngBounds();
				var path= this.getPath();
				path.forEach(function(e){
					bounds.extend(e);
					});
				return bounds;
			};
		this.parent(map, options);
		this.poly = new google.maps.Polyline({strokeWeight: 3,fillColor: '#5555FF',map: this.map.map,path: [],geodesic: true});
		this.getBounds = this.poly.getBounds.bind(this.poly);
		this.path = this.poly.getPath();
	},
});


var googleMapPolyGonEditor = new Class({
	Extends: googleMapPolyEditor,
	initialize: function(map, options)
	{
		if(!google.maps.Polygon.prototype.getBounds)
			google.maps.Polygon.prototype.getBounds = function(){
				var bounds=new google.maps.LatLngBounds();
				this.getPaths().forEach(function(p){
					p.forEach(function(e){
						bounds.extend(e);
						});
					});
				return bounds;
			};
		this.parent(map, options);
		this.poly = new google.maps.Polygon({strokeWeight: 3,fillColor: '#5555FF',map: this.map.map,paths: new google.maps.MVCArray([this.path]),geodesic: true});
		this.getBounds = this.poly.getBounds.bind(this.poly);
	},
	
	addPoint: function(latLng)
	{
		var marker = this.parent(latLng);
		var right=(this.markers.length>0)?this.markers[0]:null;
		marker.right = right;
		if(right)
		{
			this.getLineMarkerFor(marker);
			right.left=marker;
		}
	 },
});

var backendGoogleMap = new Class({
	Implements: [Options, Events],
	options:{},
	container: null,
	mode: '',
	initialize: function(container, options)
	{
		// this.setOptions(options);
		this.options = options;
		this.container = new Element('div', {'id':'googlemap', style: 'padding:5px;height:500px;width:680px;display:block;'});
		this.container.inject($(container), 'bottom');
		this.map = new google.maps.Map(this.container, {zoom:12,center:this.options.center,mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.HYBRID]},mapTypeId:google.maps.MapTypeId.ROADMAP});
		this.options.markerimage=new google.maps.MarkerImage('http://www.google.com/mapfiles/marker.png');
	},

	geocode: function(query, cb)
	{
		var coder = new google.maps.Geocoder();
		coder.geocode(query, (function(results, status) {
			if (status == google.maps.GeocoderStatus.OK){cb(results);}
		}));
	},

	updateRemoteField: function(fieldname, value)
	{
		var field=$(this.options[fieldname]);
		if(field)
		{
			field.value=value;
		}
	},

	markerEdit: function()
	{
		var me=this;
		me.mode='marker';
		me.search = new Element('form', {'id':'googlemapsearch', style: 'width:230px;'});
		me.search.set('html', '<input type="text" style="width:160px;" /><input type="submit" style="width:40px;" />');
		$(me.search).getElement('input[type=submit]').addEvent('click', function(e){
			e.stop();
			me.geocode({address:$(me.search).getElement(' input[type=text]').value},
				function(results)
				{
						var data = results[0];
						me.setLocation(data.geometry.location.lat(), data.geometry.location.lng());
				});
		});
		me.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(me.search);
		me.marker=new google.maps.Marker({position: me.options.center, map: me.map, icon: me.options.markerimage});
		me.marker.setDraggable(true);

		var markerDragEnd=(function(){
			p=me.marker.getPosition();
			me.setLocation(p.lat(),p.lng());
			if(me.options.remote_street || me.options.remote_city || me.options.remote_region || me.options.remote_country)
			{
				// ask google where we are.
				me.geocode({latLng: me.marker.getPosition()}, function(results){
					var addr=results[0].address_components;
					if(console)
						console.log(addr);
					// clear remote fields
					me.updateRemoteField('remote_street', '');
					me.updateRemoteField('remote_city', '');
					me.updateRemoteField('remote_region', '');
					me.updateRemoteField('remote_country', '');
					for(var i=0;i<addr.length;i++)
					{
						var entry=addr[i];
						if(!entry.types)
							continue;
/*
						if(entry['types'].contains('postalcode'))
							me.updateRemoteField('remote_postalcode', entry['long_name']);
						if(entry['types'].contains('street_number'))
							me.updateRemoteField('remote_street_nr', entry['long_name']);

*/
						if(entry['types'].contains('street_address') || entry['types'].contains('route'))
							me.updateRemoteField('remote_street', entry['long_name']);
//						if(entry['types'].contains('administrative_area_level_3') || entry['types'].contains('locality'))
						if(entry['types'].contains('political') && entry['types'].contains('locality'))
							me.updateRemoteField('remote_city', entry['long_name']);
						if(entry['types'].contains('administrative_area_level_1'))
							me.updateRemoteField('remote_region', entry['long_name']);
						if(entry['types'].contains('country'))
							me.updateRemoteField('remote_country', entry['long_name']);
					}
				});
			}

		}).bind(this);

		google.maps.event.addListener(this.marker, 'dragend', markerDragEnd);
	},

	translateToPoints: function(data)
	{
		var pos=[];
		data.each(function(e){
			var c=e.split(',');
			if(c.length>=2)
				pos.push({latLng: new google.maps.LatLng(parseFloat(c[0]), parseFloat(c[1])), altitude:c[1]?parseFloat(c[2]):null});
		});
		return pos;
	},

	polygonEdit: function()
	{
		this.mode='polygon';
		this.container.getParent().getElement('textarea').setStyle('display', 'none');
		this.editor = new googleMapPolyGonEditor(this, {});
		// load values.
		var data=$(this.options.inputid).value.split("\n");
		if(data.length>1)
		{
			var pos=this.translateToPoints(data);
			pos.each(function(e){this.editor.addPoint(e.latLng, e.altitude);}, this);
			this.map.setCenter(this.editor.getBounds().getCenter());
		} else
			google.maps.event.addListener(this.map, 'click', this.editor.addTriangle.bind(this.editor));
	},

	polylineEdit: function()
	{
		this.mode='polyline';
		this.container.getParent().getElement('textarea').setStyle('display', 'none');
		this.editor = new googleMapPolyLineEditor(this, {});
		// load values.
		var data=$(this.options.inputid).value.split("\n");
		if(data.length>1)
		{
			var pos=this.translateToPoints(data);
			pos.each(function(e){this.editor.addPoint(e.latLng, e.altitude);}, this);
			this.map.setCenter(this.editor.getBounds().getCenter());
		} else
			google.maps.event.addListener(this.map, 'click', this.editor.addTriangle.bind(this.editor));
	},

	setLocation: function(lat, lng)
	{
		this.marker.setPosition(new google.maps.LatLng(lat, lng));
		this.map.panTo(this.marker.getPosition());
		$(this.options.inputid).value=lat+','+lng;
	},
	close: function()
	{
		if((this.mode=='polygon') || (this.mode=='polyline'))
		{
			this.container.getParent().getElement('textarea').setStyle('display', 'block');
			this.editor.close();
			delete this.editor;
			this.editor = null;
		}
		this.container.destroy();
	}
});