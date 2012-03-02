(function(){

ContaoMapping.Marker = new ContaoMapping.Class({
	Extends: ContaoMapping.MapObject,
	initialize: function(map, options)
	{
		this.parent(map, options);
	},
});

ContaoMapping.Classes.ContaoMapObjectMarker=ContaoMapping.Marker;

})();
