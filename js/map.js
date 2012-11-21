(function(){

ContaoMapping.Map = new ContaoMapping.Class({
	Implements: [Options, Events],
	datadriver:null,
	$scripts: [],
	options:{},
	layers: [],

	initialize: function(container, options)
	{
		this.setOptions(options);
		this.id=this.options.id;
		this.container = container;
		ContaoMapping.Map.instances.push(this);

		this.createNative();

		// TODO: determine which datadriver to use. or even better pass driver instantiation in global script.
		var drvclass=ContaoMapping.getDataDriver('application/json');
		var me=this;
		this.datadriver= new drvclass({map:me, url:this.options.url, additionalparams: this.options.additionalparams});

		this.fireClassEvent('initialize', [this]);
	},

	getImplementationType: function()
	{
		return null;
	},

	boundsChanged: function()
	{
		this.datadriver.loadMapData.apply(this.datadriver);
	},

	createNative: function()
	{
		return null;
	},

	getNative: function()
	{
		return null;
	},

	savePosition: function()
	{
		this.position = this.getCenter();
	},

	revertPosition: function()
	{
		if(this.position)
			this.panTo(this.position);
		this.position = null;
	},

	/**
	 * @param array location latitude and longitude of the new center position.
	 */
	setCenter: function(location)
	{
		return this;
	},

	/**
	 * @return array latitude[0] and longitude[1] of the new center position.
	 */
	getCenter: function()
	{
		return null;
	},

	/**
	 * @param array location latitude and longitude of the new center position.
	 */
	panTo: function(location)
	{
		return this;
	},

	/**
	 * call native implementation to return the extended bounds of the current viewport.
	 * @return string the url encoded values in the form "lat_ne,lon_ne,lat_sw,lon_sw"
	 */
	getExtendedBoundsAsUrl: function()
	{
		return null;
	},

	assembleKnownIds:function()
	{
		// TODO: cache this.
		var ids={};
		for(var i=0;i<this.layers.length;i++)
			ids[this.layers[i].getId()]=this.layers[i].getIds();
		return ids;
	},

	/**
	 * @param string id of the layer to retrive
	 * @param bool (optional) create the layer if no found
	 * @param object (optional) the properties for the new layer if param "create" is true
	 * @return layer object with the given id
	 */
	getLayer:function(id, create, props)
	{
		for(i=0;i<this.layers.length;i++)
		{
			if(this.layers[i].getId()==id)
				return this.layers[i];
		}
		if(create)
		{
			if(!props)
				props={};
			props.id=id;
			var layerClass=ContaoMapping.Layer[this.getImplementationType()];
			if(!layerClass)
				return null;
			layer=new layerClass(this, props);
			this.layers.push(layer);
			this.fireClassEvent('layeradded', [this, layer]);
			return layer;
		}
		return null;
	},

	/**
	 * generates a unique id for use in dynamic objects.
	 */
	getUniqueId: function()
	{
		var name;
		while(!name || this.$scripts[name])
		{
			var n=Math.floor(Math.random()*11)+65;
			var k = Math.floor(Math.random()* 1000000);
			name=String.fromCharCode(n)+k;
		}
		return name;
	},

	/**
	 * removes the script with the given id from the DOM and the local storage
	 * @param string id the id of the script to remove
	 */
	killscript: function(id)
	{
		var script = this.$scripts[id];
		if(script)
		{
			$(script).destroy();
			delete(this.$scripts[id]);
		}
	},

	/**
	 * Runs the given code in context of this map object.
	 * @param string code the code to execute.
	 */
	runcode: function(code)
	{
		var id = this.getUniqueId();
		// there might be some more elegant variant but it works pretty well this way.
		code = '(function(){'+code+'; this.killscript("'+id+'");}).bind('+this.options.id+').run();';
		var e = document.createElement("script");e.type="text/javascript";
		/* IE does not allow <script> to have children. :( */
		if (null == e.canHaveChildren || e.canHaveChildren){e.appendChild(document.createTextNode(code));}
		else {e.text = code;}
		this.$scripts[id]=e;
		document.getElementsByTagName("head")[0].appendChild(e);
	},

	getGeolocation:function(successCallback, errorCallback)
	{
		// Try W3C Geolocation see http://www.w3.org/TR/geolocation-API/#position for details of the return value.
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(
				function(position) {if(successCallback)successCallback([position.coords.latitude, position.coords.longitude]);},
				function(){if(errorCallback)errorCallback(true);}
			);
			return;
		}
		// Browser doesn't support Geolocation
		if(handleNoGeolocation)
			handleNoGeolocation(false);
	},
});

ContaoMapping.Map.instances=[];


})();