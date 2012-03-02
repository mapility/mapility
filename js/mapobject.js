(function(){

ContaoMapping.MapObject = new ContaoMapping.Class({
	Implements: [Options, Events],
	$map: null,
	options:{},
	$layer: null,

	initialize: function(map, options)
	{
		this.setOptions(options);
		this.$map=map;
		this.fireClassEvent('initialize', [this]);
	},

	createNative: function()
	{
		return null;
	},

	getId: function()
	{
		return this.options.id;
	},

	getNative: function()
	{
		return null;
	},

	setLayer: function(layer)
	{
		if(this.$layer)
			this.$layer.remove(this);
		this.$layer=layer;
		return this;
	},

	getLayer: function()
	{
		return this.$layer;
	},

	getMap: function()
	{
		return this.$map;
	},

	show: function()
	{
		return this;
	},

	hide: function()
	{
		return this;
	}
});

})();
