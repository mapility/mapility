(function(){

ContaoMapping.Layer = new ContaoMapping.Class({
	Implements: [Options, Events],
	options: {},
	objects: [],
	implementation: null,

	initialize: function(map, options) {
		this.setOptions(options);
		this.map=map;
		this.name=options.name;
		this.hidden=false;
	},

	getMap: function()
	{
		return this.map;
	},

	getId: function()
	{
		return this.options.id;
	},

	getIds: function()
	{
		var ids = [];
		this.objects.each(function(obj, i){
			ids.push(obj.getId());
		});
		return ids;
	},

	add: function(obj)
	{
		obj.setLayer(this);
		this.objects.push(obj);
	},

	remove: function(obj)
	{
		obj.setLayer(null);
		var index = this.objects.indexOf(obj);
		if (index != -1) delete this.objects[index];
	},

	has: function(obj)
	{
		if(typeof(obj)=='string')
		{
			for(var i=0;i<this.objects.length;i++)
			{
				if(this.objects[i].getId()==obj)
					return true;
			}
			return false;
		} else
			return (this.objects.indexOf(obj) != -1);
	},

	show: function()
	{
		
	},

	hide: function()
	{
		
	}

});


})();
