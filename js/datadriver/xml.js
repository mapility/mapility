(function(){

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

})();