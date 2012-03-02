(function(){

ContaoMapping.Code = new ContaoMapping.Class({
	Extends: ContaoMapping.MapObject,
	initialize: function(map, options)
	{
		this.parent(map, options);
		this.getMap().runcode(this.options.code);
		// TODO: we need a way to vaporize ourselves.
	},
});

ContaoMapping.Classes.ContaoMapObjectCode=ContaoMapping.Code;

})();
